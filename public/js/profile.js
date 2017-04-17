$(function () {
  // your code here
  $('#editToggleBtn').click(function () {
    if ($('input').prop('disabled')) {
      $('input').prop('disabled', false)
      $('#saveBtn').attr('disabled', null)
      $('#changePwdBtn').attr('disabled', null)
    } else {
      $('input').prop('disabled', true)
      $('#saveBtn').attr('disabled', 'disabled')
      $('#changePwdBtn').attr('disabled', 'disabled')
    }
  })
})
