import mongoose from 'mongoose';
import parse from 'co-body';
import { exec } from 'child_process';

const Category = mongoose.model('Category', new mongoose.Schema({
    name: {
        type: String,
        enum: ['weather', 'social_media', 'everything_else']
    },
    subcategories: [String]

}));

const Wing = mongoose.model('Wing', new mongoose.Schema({
    // wingId: Number,
    heading: String,
    story: String,
    categories: [Category],
    impact: {
        type: Number,
        min: 0,
        max: 5
    },
    source: {
        type: String,
        enum: ['scraper1', 'scraper2', 'scraper3']
    },
    received: { type: Date, default: Date.now },
    processed: Date,
    status: {
        type: String,
        enum: ['accepted', 'declined', 'waiting']
    }
}));



export async function getWings(ctx) {
    const results = await Bulletin.find();
    ctx.body = JSON.stringify(results);
}

export async function postWing(ctx) {
    const parsed = await parse(ctx);
    parsed.status = 'waiting';

    //example of using different models for different categories..
    if (parsed.categories.includes('weather')){
        exec(`python weatherModel.py "${parsed.text}"`, (err, stdout, stderr) => {
            if (err) {
                console.log(err, 'errors');
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            parsed.impact = stdout;
        });
    }


    // console.log(parsed);
    // newsworth from python world
    //parsed.push({rating:{credibility, }})
    await Wing.create(parsed);
    ctx.body = {data: 'very niceee'};
}

export async function processWing(ctx) {
    const parsed = await parse(ctx);

    await Wing.update({_id: parsed.id}, { $set: {processed: parsed.processed}})
}