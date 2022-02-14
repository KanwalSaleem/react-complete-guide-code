const verificationResult = (item) => `<html lang="en">
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
    .inline-flex { display: inline-flex; display: inline-flex; align-items: center; width: 100%; justify-content: space-between;}
    .inline-flex > p:first-child { margin-right: 5px;  text-align: left; }
  </style>
</head>
<body>
  <div class="container">
    <img alt="" src='data:image/png;base64,${
      item.photo
    }' alt="result" width="100px" height="100px" />

    <p class="gender">Male</p>

    <p class="blue-Heading">Personal Information</p>

    <div class="inline-flex">
      <p class="heading">National Identification Number (NIN)</p>
      <p class="detail">${item.nin}</p>
    </div>
    <div class="inline-flex">
      <p class="heading">Tracking ID</p>
      <p class="detail">${item.trackingId}</p>
    </div>
    <div class="inline-flex">
      <p class="heading">First Name</p>
      <p class="detail">${item.firstname}</p>
    </div>
    <div class="inline-flex">
      <p class="heading">Middle Name</p>
      <p class="detail">${item.middlename || ''}</p>
    </div>
    <div class="inline-flex">
      <p class="heading">Last Name</p>
      <p class="detail">${item.surname}</p>
    </div>
    <div class="inline-flex">
      <p class="heading">Date of birth</p>
      <p class="detail">${item.birthdate}</p>
    </div>
    <div class="inline-flex">
      <p class="heading">Residence</p>
      <p class="detail">${item.residence_Town}</p>
    </div>
    <div class="inline-flex">
      <p class="heading">Address</p>
      <p class="detail">${item.residence_AdressLine1}</p>
    </div>
    <div class="inline-flex">
      <p class="heading">Telephone</p>
      <p class="detail">${item.telephoneno}</p>
    </div>

    <div>
      <div class="inline-flex">
        <p class="heading">Email Address</p>
        <p class="detail">${item.email}</p>
      </div>
      <div class="inline-flex">
        <p class="heading">Marital Status</p>
        <p class="detail">${item.maritalstatus}</p>
      </div>
      <div class="inline-flex">
        <p class="heading">Residence Status</p>
        <p class="detail">${item.residencestatus}</p>
      </div>
      <div class="inline-flex">
        <p class="heading">Profession</p>
        <p class="detail">${item.profession}</p>
      </div>
      <div class="inline-flex">
        <p class="heading">Origin State</p>
        <p class="detail">${item.self_origin_state}</p>
      </div>
      <div class="inline-flex">
        <p class="heading">Origin LGA</p>
        <p class="detail">${item.self_origin_lga}</p>
      </div>
      <div class="inline-flex">
        <p class="heading">Next of Kin Data</p>
        <p class="detail">${item.kinData || ''}</p>
      </div>
    </div>
  </div>
</body>
</html>
`

export default verificationResult
