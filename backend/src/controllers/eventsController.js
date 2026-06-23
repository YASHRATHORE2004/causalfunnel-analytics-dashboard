import Event from '../models/Event.js';

export const createEvent = async (req, res) => {
  try {
    const { sessionId, eventType, pageUrl, timestamp, clickX, clickY } = req.body;

    if (!sessionId || typeof sessionId !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'sessionId is required',
      });
    }

    if (!eventType || !['page_view', 'click'].includes(eventType)) {
      return res.status(400).json({
        success: false,
        error: 'eventType must be page_view or click',
      });
    }

    if (!pageUrl || typeof pageUrl !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'pageUrl is required',
      });
    }

    if (!timestamp || isNaN(new Date(timestamp).getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Valid timestamp is required',
      });
    }

    if (eventType === 'click') {
      if (typeof clickX !== 'number' || typeof clickY !== 'number') {
        return res.status(400).json({
          success: false,
          error: 'clickX and clickY must be numbers for click events',
        });
      }
    }

    const event = await Event.create({
      sessionId,
      eventType,
      pageUrl,
      timestamp,
      clickX: clickX ?? null,
      clickY: clickY ?? null,
    });

    return res.status(201).json({
      success: true,
      eventId: event._id.toString(),
    });
  } catch (error) {
    console.error('Create Event Error:', error);

    return res.status(500).json({
      success: false,
      error: 'Failed to create event',
    });
  }
};