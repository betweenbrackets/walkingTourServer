const mongoose = require('mongoose');
const Schema = mongoose.Schema; //defining Schema to use Schema object

require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;
//creating a Schema Object for commentSchema

var commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    usePushEach: true,
    timestamps: true
});

// const commentSchema = new Schema({
//     //JSON Object //JSON is not JS but can convert
//     rating: {
//         type: Number, //declaring that value type is number
//         min: 1, //declaring a variable w default value
//         max: 5,// ""
//         required: true // declaring Boolean
//     },
//     comment: {
//         type: String,
//         required: true
//     },
//     author: {
//         type: String,
//         required: true
//     }
// }, {
//     timestamps: true
// });

var dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    price: {
        type: Currency,
        required: true,
        min: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    comments: [commentSchema]//array of comment schema object
    //one to many
    //meaning a dish object can have multiple comments
},
    {
        usePushEach: true,//this will push into array of comments line 62
        timestamps: true//this states include create and updated
    });
//
var Dishes = mongoose.model('Dish', dishSchema);

module.exports = Dishes;