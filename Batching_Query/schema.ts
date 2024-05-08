// schema.ts
import { makeSchema, objectType, subscriptionField, intArg, nonNull, extendType } from 'nexus';
import mongoose from 'mongoose';

mongoose.connect('mongodb://127.0.0.1:27017/test')
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

const PostModel = mongoose.model('Post', new mongoose.Schema({
  id: Number,
  title: String,
  body: String,
  published: Boolean
}));

export const Post = objectType({
  name: 'Post',
  definition(t) {
    t.int('id')
    t.string('title')
    t.string('body')
    t.boolean('published')
  },
})

export const ViewPost = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.field('viewPosts', {
      type: 'Post',
      resolve: async(_, __, ___) => {
        return await PostModel.find({});
      }
    })
  },
})

export const schema = makeSchema({
  types: [Post, ViewPost],
  outputs: {
    schema: __dirname + '/generated/schema.graphql',
    typegen: __dirname + '/generated/nexus.ts',
  },
})
