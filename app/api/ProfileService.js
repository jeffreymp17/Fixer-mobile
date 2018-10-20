const URL="http://192.168.1.4:8000/api/";

function getUserLogged(){
  return fetch(`${URL}users`)
  .then((response)=>response.json())
  .then((data)=>{
    console.log("USERS",data.data);
    return data;
  }).catch((error) => {
      console.error(error);
    });
}
export {getUserLogged}
