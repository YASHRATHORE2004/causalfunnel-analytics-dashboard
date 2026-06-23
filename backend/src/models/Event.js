import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      trim: true,
    },
    eventType: {
      type: String,
      required: true,
      enum: ['page_view', 'click'],
    },
    pageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    timestamp: {
      type: Date,
      required: true,
    },
    clickX: {
      type: Number,
      default: null,
    },
    clickY: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

EventSchema.index({ sessionId: 1 });
EventSchema.index({ pageUrl: 1 });
EventSchema.index({ eventType: 1 });
EventSchema.index({ timestamp: 1 });
EventSchema.index({ sessionId: 1, timestamp: 1 });
EventSchema.index({ pageUrl: 1, eventType: 1 });

const Event = mongoose.model('Event', EventSchema, 'events');

export default Event;