const Wing = mongoose.model('Wing', new mongoose.Schema({
    // wingId: Number,
    heading: String,
    story: String,
    categories: Array,
    impact: {
        type: Number,
        min: 0,
        max: 5
    },
    source: {
        type: String,
        enum: ['scraper1', 'scraper2', 'scraper3']
    },
    received: Date,
    processed: Date,
    status: {
        type: String,
        enum: ['accepted', 'declined', 'waiting']
    }
}));
