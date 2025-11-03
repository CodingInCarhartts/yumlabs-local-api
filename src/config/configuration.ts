export default () => ({
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/yumlabs',
  },
  port: parseInt(process.env.PORT, 10) || 3000,
});
