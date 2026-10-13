const estimateForm = document.querySelector('.estimate-form');
const estimateStatus = document.querySelector('.estimate-status');

// UI preview only. Connect a submission destination when it is supplied.
estimateForm.addEventListener('submit', (event) => {
  event.preventDefault();
  estimateStatus.textContent = 'This form is a preview. Your request has not been sent.';
  estimateStatus.hidden = false;
});
