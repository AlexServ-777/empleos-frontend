export default function Modal_pers(){
    return(
    <>
    <div class="card green">
    <div class="card-header">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="close">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"></path>
      </svg>
    </div>
    <div class="card-body">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
        <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd"></path>
      </svg>

      <div>

        <h3>Your file was uploaded!</h3>
        <p>Your file was succesfully uploaded. You can copy the link to your clipboard.</p>

      </div>

    </div>
    <div class="progress">
      <a href="#" class="btn-first">Copy Link</a>
      <a href="#" class="btn-second">Done</a>
    </div>
  </div>
    </>)
}