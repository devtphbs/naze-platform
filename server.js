import NodeMediaServer from 'node-media-server';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

// Simple API to get current live streams
app.get('/api/streams', (req, res) => {
  const sessions = nms.getSessionInfo() || {};
  const activeStreams = [];
  
  // Extract RTMP publishers from the sessions
  Object.values(sessions).forEach(session => {
    if (session.app === 'live' && session.streamPath) {
      // Get the stream key (e.g., 'live/user123' -> 'user123')
      const streamKey = session.streamPath.split('/').pop();
      if (streamKey) {
        // Calculate bitrate from byte count if needed, or use session stats
        // NodeMediaServer sessions have bitrates in session.publisher?
        const stats = session.publisher ? {
          bitrate: Math.floor(session.publisher.bitrate || 0),
          fps: Math.round(session.publisher.fps || 0),
          width: session.publisher.width,
          height: session.publisher.height,
        } : { bitrate: 0, fps: 0 };

        activeStreams.push({
          streamKey,
          id: session.id,
          startTime: session.connectTime,
          stats
        });
      }
    }
  });
  
  res.json({ streams: activeStreams });
});

app.listen(8001, () => {
  console.log('Naze REST API running on http://localhost:8001');
});

const nmsConfig = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000,
    allow_origin: '*'
  }
};

const nms = new NodeMediaServer(nmsConfig);

nms.on('prePublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  // In a real app, you would validate the stream key here against a database
});

nms.run();

console.log('Naze RTMP Server started. Stream to rtmp://localhost:1935/live/{streamKey}');
