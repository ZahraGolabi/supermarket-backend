const showSwal=(title,text,icon,confirmButtonText)=>{
return Swal.fire({
  title,
  text,
  icon,
  confirmButtonText,
});
}

export {showSwal}