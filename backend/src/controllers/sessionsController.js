import Event from '../models/Event.js';

export const getSessions = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 20, 1);
    const skip = (page - 1) * limit;

    const result = await Event.aggregate([
      {
        $group: {
          _id: '$sessionId',
          firstSeen: { $min: '$timestamp' },
          lastSeen: { $max: '$timestamp' },

          pageViewCount: {
            $sum: {
              $cond: [{ $eq: ['$eventType', 'page_view'] }, 1, 0],
            },
          },

          clickCount: {
            $sum: {
              $cond: [{ $eq: ['$eventType', 'click'] }, 1, 0],
            },
          },

          eventCount: { $sum: 1 },
        },
      },

      {
        $addFields: {
          durationSeconds: {
            $divide: [
              { $subtract: ['$lastSeen', '$firstSeen'] },
              1000,
            ],
          },
        },
      },

      {
        $project: {
          _id: 0,
          sessionId: '$_id',
          firstSeen: 1,
          lastSeen: 1,
          pageViewCount: 1,
          clickCount: 1,
          eventCount: 1,
          durationSeconds: { $round: ['$durationSeconds', 0] },
        },
      },

      {
        $sort: {
          lastSeen: -1,
        },
      },

      {
        $facet: {
          metadata: [
            {
              $count: 'total',
            },
          ],

          data: [
            { $skip: skip },
            { $limit: limit },
          ],
        },
      },
    ]);

    const total = result[0]?.metadata?.[0]?.total || 0;
    const sessions = result[0]?.data || [];

    return res.status(200).json({
      sessions,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error('Get Sessions Error:', error);

    return res.status(500).json({
      success: false,
      error: 'Failed to fetch sessions',
    });
  }
};

export const getSessionById = async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId || !sessionId.trim()) {
      return res.status(400).json({
        success: false,
        error: 'sessionId is required',
      });
    }

    const events = await Event.find({ sessionId })
      .sort({ timestamp: 1 })
      .lean();

    if (!events.length) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
      });
    }

    const firstSeen = events[0].timestamp;
    const lastSeen = events[events.length - 1].timestamp;

    const { pageViewCount, clickCount } = events.reduce(
      (acc, event) => {
        if (event.eventType === 'page_view') acc.pageViewCount++;
        if (event.eventType === 'click') acc.clickCount++;
        return acc;
      },
      {
        pageViewCount: 0,
        clickCount: 0,
      }
    );

    const eventCount = events.length;

    const durationSeconds = Math.max(
      0,
      Math.round(
        (new Date(lastSeen).getTime() -
          new Date(firstSeen).getTime()) /
          1000
      )
    );

    return res.status(200).json({
      sessionId,
      firstSeen,
      lastSeen,
      pageViewCount,
      clickCount,
      eventCount,
      durationSeconds,
      events: events.map((event) => ({
        eventType: event.eventType,
        pageUrl: event.pageUrl,
        timestamp: event.timestamp,
        clickX: event.clickX,
        clickY: event.clickY,
      })),
    });
  } catch (error) {
    console.error('Get Session By Id Error:', error);

    return res.status(500).json({
      success: false,
      error: 'Failed to fetch session',
    });
  }
};