$(function () {
  $('#AccountModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var formType = button.data('form-type')
    var modal = $(this)

    if (formType === 'edit') {
      var accountId = button.data('account-id')
      var accountName = button.data('account-name')

      modal.find('.modal-title').text('Edit Account')
      modal.find('form#accountForm').attr('action', '/accounts/' + accountId + '?_method=PUT')
      modal.find('input').val(accountName)
      modal.find('button#addEditButton').text('Save')
    } else if (formType === 'add') {
      modal.find('.modal-title').text('Add New Account')
      modal.find('form#accountForm').attr('action', '/accounts/')
      modal.find('button#addEditButton').text('Save')
    }
  })
})
