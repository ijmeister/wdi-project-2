$(function () {
  $('a.list-group-item').click(function (event) {
    if ($(event.target)[0].nodeName !== 'A') {
      event.preventDefault()
    }
  })
  $('.btn-danger').click(function (event) {
    event.preventDefault()
    bootbox.confirm('Are you sure if you want to delete?', function (result) {
      if (result) {
        $(event.target.parentNode).submit()
      }
    })
  })
  $('#AccountModal').on('show.bs.modal', function (event) {
    // event.stopPropagation()
    var button = $(event.relatedTarget) // Button that triggered the modal
    var formType = button.data('form-type')
    var modal = $(this)

    if (formType === 'edit') {
      var accountId = button.data('account-id')
      var accountName = button.data('account-name')
      var accountType = button.data('account-type')

      modal.find('.modal-title').text('Edit Account')
      modal.find('form#accountForm').attr('action', '/accounts/' + accountId + '?_method=PUT')
      modal.find('input').val(accountName)
      modal.find('option[value="' + accountType + '"]').attr('selected', true)
      modal.find('button#addEditButton').text('Save')
    } else if (formType === 'add') {
      modal.find('.modal-title').text('Add New Account')
      modal.find('form#accountForm').attr('action', '/accounts/')
      modal.find('button#addEditButton').text('Save')
    }
  })
  $('#TransactionFormModal').on('show.bs.modal', function (event) {
    // event.stopPropagation()
    var button = $(event.relatedTarget) // Button that triggered the modal
    var formType = button.data('form-type')
    var modal = $(this)

    if (formType === 'edit') {
      var transId = button.data('trans-id')
      // var accountId = button.data('account-id')
      var subcatid = button.data('input-subcatid')
      var comment = button.data('input-comment')
      var income = button.data('input-income')
      var expense = button.data('input-expense')

      // date
      var date = button.data('input-date')
      var arr = date.split('/')
      var day = arr[1]
      var month = arr[0]
      var year = arr[2]
      if (Number(day) < 10) { day = '0' + day }
      if (Number(month) < 10) { month = '0' + month }

      modal.find('.modal-title').text('Edit Transaction')
      modal.find('form#transactionForm').attr('action', '/transactions/' + transId + '?_method=PUT')
      modal.find('input#dateInput').val(year + '-' + month + '-' + day)
      modal.find('option[value=' + subcatid + ']').attr('selected', true)
      modal.find('input#transIncomeInput').val(income)
      modal.find('input#transExpenseInput').val(expense)
      modal.find('input#transCommentInput').val(comment)

      modal.find('button#addEditTransButton').text('Save')
    } else if (formType === 'add') {
      modal.find('.modal-title').text('Add New Transaction')
      modal.find('form#transactionForm').attr('action', '/transactions/')
      modal.find('input#transIncomeInput').val(0)
      modal.find('input#transExpenseInput').val(0)
      modal.find('input#transCommentInput').val('')
      modal.find('button#addEditButton').text('Save')
    }
  })
})
