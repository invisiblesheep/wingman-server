import mongoose from 'mongoose';
import parse from 'co-body';
import { exec } from 'child_process';

// const Category = mongoose.model('Category', new mongoose.Schema({
//     name: {
//         type: String,
//         enum: ['weather', 'social_media', 'everything_else']
//     },
//     subcategories: [String]
//
// }));

const Wing = mongoose.model('Wing', new mongoose.Schema({
    // wingId: Number,
    heading: String,
    story: String,
    url: String,
    categories: {
        type: String,
        enum: ['weather', 'strike']
    },
    impact: {
        type: Number,
        min: 0,
        max: 3
    },
    source: {
        type: String,
        enum: ['social_media', 'weather-scraper', 'flightcontrol']
    },
    received: { type: Date, default: Date.now },
    processed: Date,
    status: {
        type: String,
        enum: ['accepted', 'declined', 'waiting']
    }
}));



export async function getWings(ctx) {
    const results = await Wing.find({status: 'waiting'});
    ctx.body = JSON.stringify(results);
}

export async function getEvents(ctx) {
    const results = await Wing.find({status:'accepted'});
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
    console.log(parsed);
    await Wing.update({_id: parsed._id}, { $set: {processed: parsed.processed, status: parsed.status }});

    ctx.body = {data: 'updated'};
}
