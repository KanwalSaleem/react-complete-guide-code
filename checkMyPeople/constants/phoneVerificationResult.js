const phoneVerificationResult = (item) => `<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Document</title>
  <style>
  body {
    /* align-items: center; */
    justify-content: center;
    display: flex;
  }
  .container {
    max-width: 1140px;
    width: 312px;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* align-items: center; */
  }

  img {
    width: 10rem;
    height: 9.8rem;
    align-self: center;
    aspect-ratio: 3/3;
  }
  .gender {
    padding: 1rem;
    border: 1px solid black;
    align-self: flex-start;
    border-radius: 5px;
    margin-top: 20px;
    align-self: flex-start;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande',
      'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    align-self: center;
  }

  .blue-Heading {
    font-size: 18;
    color: #4c96d6;
    font-weight: 700;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande',
      'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    /* align-self: flex-start; */
  }
  .heading {
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande',
      'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    font-weight: 700;
    text-align: center;
  }
  .detail {
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande',
      'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    text-align: center;
  }
  .detail-container {
    align-self: flex-start;
  }
  </style>
</head>
<body>
  <div class="container">
    <!-- <div class="image-container"> -->
   <img alt="" src='data:image/png;base64,${item.photo}'/>
    <!-- </div> -->
    <!-- <div style="align-self: center"> -->
    <p class="gender">${item.gender === 'f' ? 'Female' : 'Male'}</p>
    <!-- </div> -->
    <p class="blue-Heading">Personal Information</p>
   
        
        
        <div>
          <p class="heading">First Name</p>
          <p class="detail">${item.firstname}</p>
        </div>
        <div>
          <p class="heading">Middle Name</p>
          <p class="detail">${item.middlename}</p>
        </div>
        <div>
          <p class="heading">Last Name</p>
          <p class="detail">${item.surname}</p>
        </div>
       
     
  </div>
</body>
</html>
`

export default phoneVerificationResult
