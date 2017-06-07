const moment = require('moment');

const Notification = require('./models/notification');
const Bill = require('./models/bill');
const Payment = require('./models/payment');

let NotificationChecker = new Object();

NotificationChecker.isBillInPaymentsMadeForMonth = function (id, paymentsMadeArray) {
  // return true if the bill id exists in the current bills paid array

  for(let i = 0; i < paymentsMadeArray.length; i++ ) {
    /// if this payment made bill id matches the id we are checking for, return true (it has been paid)
    console.log("Is this bill id in the payments made for the month: ")
    if(paymentsMadeArray[i].bill_id == id) return true;
  }
  // Return false if this payment was not the match for the bill being searched for
  return false;
};


NotificationChecker.checkForNotifications = function (req) {
  let user_id = req.user._id;

  Bill.find({'user_id': user_id}, function (err, bills) {
    if(err) console.log('Err: ', err);

    // month in moment is 0 based, so 9 is actually october, subtract 1 to compensate
    // array is 'year', 'month', 'day', etc
    let startOfMonth = moment([moment().year(), moment().month()]).add(0,"month");
    let endOfMonth = moment(startOfMonth).endOf('month');

    let currentDayOfMonth = moment().date();

    let currentUserDaySetting = req.user.daysBeforeNotice;

    Payment.find({user_id: req.user._id, payment_date: {$gte: startOfMonth, $lt: endOfMonth}}, function (err, payments) {
      // Find all payments where payment_date is in the current month and year
      if(err) console.log('Err: ', err);

      // need all bills that do not have a payment
      for (let bill of bills) {
        let thisBillIsPaid = NotificationChecker.isBillInPaymentsMadeForMonth(bill._id, payments);
        let dayOfMonthBillDue = bill.datedue;
        // if a false was returned for this bill, it has not been paid yet. Only push on bill if it is false (has not been paid)

        if(!thisBillIsPaid) {
          // push bill copy onto temporary array that will get returned

          // if the current day of month is within the days they want an alert, push onto unpaid
          if((currentDayOfMonth + currentUserDaySetting) > dayOfMonthBillDue) {

            let notification = new Notification({
              bill_name: bill.name,
              message: "Pay your bill",
              read: false,
              datedue: new Date(moment().year(), moment().month(), dayOfMonthBillDue)
            });


            Notification.find({bill_name: bill.name}, function (err, notifications) {
              if (notifications.length){
                // Don't recreate
              }else{
                // Route for saving Payments to the payments database
                notification.save(function (err, notice) {
                  if (err) console.log('error saving notification: ', err);
                });
              }
            });
          }
        }
      }
    })
  })

};

module.exports = NotificationChecker;
