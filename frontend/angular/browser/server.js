const express = require('express')

const path = require('path')

const PORT = process.env.PORT || 80;
const HOST = process.env.HOST;

const app = express()

app.use('/', express.static(path.join(__dirname)));

app.get('', (req, res) => {
  res.sendFile(path.join(__dirname,'index.html'));
});

app.listen(PORT,()=>{
  console.log(`server running at http://localhost:${PORT}`);
})