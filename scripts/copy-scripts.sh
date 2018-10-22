mkdir -p _attachments/build _attachments/node_modules/@scion-scxml/monitor-middleware _attachments/node_modules/@scion-scxml/monitor-middleware/dist _attachments/node_modules/@scion-scxml/scxml/dist _attachments/node_modules/babel-polyfill/dist

cp ./build/morse.scxml _attachments/build
cp ./index.html _attachments/
cp ./node_modules/@scion-scxml/monitor-middleware/dist/client.js _attachments/node_modules/@scion-scxml/monitor-middleware/dist/
cp ./node_modules/@scion-scxml/scxml/dist/scxml.min.js _attachments/node_modules/@scion-scxml/scxml/dist/
cp ./node_modules/babel-polyfill/dist/polyfill.js _attachments/node_modules/babel-polyfill/dist/
