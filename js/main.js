document.addEventListener('DOMContentLoaded', init);

function init() {
  //handle form submission
  document.querySelector('form')?.addEventListener('submit', uploadFile);
  //fetch the flavours
  const url = 'http://localhost:3333/api/flavours';
  const req = new Request(url, {
    method: 'get', // methods PUT, PATCH, or DELETE trigger CORS preflight request
    headers: {
      'X-Custom': 'Easter Egg', //add custom header to trigger CORS
      //Authorization header will trigger CORS preflight
      //content-type other than application/x-www-form-urlencoded, multipart/form-data, or text/plain
      // will also trigger CORS preflight... eg: application/json
    },
    // credentials: 'include', //will trigger a CORS preflight request
  });
  let main = document.querySelector('main');
  fetch(req)
    .then((response) => {
      if (!response.ok) throw new Error('');
      return response.json();
    })
    .then((data) => {
      console.log(data.results);
      let pre = document.createElement('pre');
      main.innerHTML = '';
      pre.innerText = data.results.map((obj) => `Name: ${obj.name}`).join('\n');
      main.append(pre);
    })
    .catch((err) => {
      console.warn(err.message);
      main.innerHTML = `<h3>${err.message}</h3>`;
    });
}

function uploadFile(ev) {
  ev.preventDefault();
  //upload a file from the form
  const form = ev.target;
  const fd = new FormData(form);
  if (fd.get('avatar').size > 0) {
    //upload
    console.log('attempt upload');
    const url = 'http://localhost:3333/api/upload';
    const req = new Request(url, {
      method: 'post',
      headers: {
        'X-Custom': 'Easter Egg',
        //'Content-type': 'multipart/form-data; boundary="thisBeMyBoundaryForTheFormData"',
        //LET the browser set the content-type and the boundary to avoid issues
      },
      body: fd,
    });
    fetch(req)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to upload');
        return response.text();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.warn(err);
      });
  } else {
    console.warn('Must include a non-empty file');
  }
}
