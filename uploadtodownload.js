function uploadtoDownload() {
  const reader = new FileReader();
  reader.addEventListener("load", (event) => {
    const result = event.target.result;
    //set whatever tp results
  });
  reader.addEventListener("progress", (event) => {
    if (event.loaded && event.total) {
      const percent = (event.loaded / event.total) * 100;
      console.log(`Progress: ${Math.round(percent)}`);
    }
  });
  reader.readAsDataURL(myfile.files[0]);
}

  
        // var form_data = new FormData();
        // form_data.append('media', myfile.files[0]);
        // form_data.append('name', (providername + "receipt(" + months[month - 1] + `${year})`).toUpperCase());
        // form_data.append('bill', billid);
        // $.ajax({
        //     url: 'URLINFo', // point to server-side PHP script 
        //     cache: false,
        //     contentType: false,
        //     processData: false,
        //     data: form_data,
        //     type: 'post',
        //     success: function(json) {
        //         let response = JSON.parse(json);
        //         console.log(json)
        //         // console.log(response)
        //         if (response.success) {
        //             Swal.fire({
        //                 icon: 'success',
        //                 html: '<h5>File Uploaded!</h5>'
        //             });
        //             document.getElementById("filetitle" + key).href = window.urlroot+ "/billassets/receipts/"+response.file;
        //             document.getElementById("filetitle" + key).setAttribute("download", (providername + "receipt(" + months[month - 1] + `${year})`).toUpperCase());
        //         }
        //     }
        // });