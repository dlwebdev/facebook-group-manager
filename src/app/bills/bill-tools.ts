export class BillTools {
  getUnpaidBillsForMonth(bills, paymentsMade) {
    let unpaid = [];

    console.log("Getting unpaid bills..");

    // need all bills that do not have a payment
    for(let i = 0; i < bills.length; i++ ) {
      let thisBillIsPaid = this.isBillInPaymentsMadeForMonth(bills[i]._id, paymentsMade);
      // if a false was returned for this bill, it has not been paid yet. Only push on bill if it is false (has not been paid)

      if(!thisBillIsPaid) {
        let currentDate = new Date();

        // create a copy of this bill to push onto unpaid bills array
        let newBill = bills[i];

        // create a custom date field using the current month and year from a new date object. Give it the due date as day of month
        newBill.customDueDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), newBill.datedue);

        // push bill copy onto temporary array that will get returned
        unpaid.push(newBill);
      }

    }

    // sort this array by custom sort function that uses datedue
    unpaid.sort(this.sortUnpaidBills);

    return unpaid;
  }

  sortUnpaidBills(a, b) {
    //this.billsUnpaid = somethingsorted();
    if (a.datedue < b.datedue)
      return -1;
    if (a.datedue > b.datedue)
      return 1;
    return 0;
  }

  isBillInPaymentsMadeForMonth(id, paymentsMadeArray) {
    // return true if the bill id exists in the current bills paid array
    for(let i = 0; i < paymentsMadeArray.length; i++ ) {
      /// if this payment made bill id matches the id we are checking for, return true (it has been paid)
      if(paymentsMadeArray[i].bill_id == id) return true;
    }
    // Return false if this payment was not the match for the bill being searched for
    return false;
  }
}
