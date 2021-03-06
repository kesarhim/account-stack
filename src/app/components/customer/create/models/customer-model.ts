export class Customer {
   id: number;
   mobileNo:string;
   aadhaarNo:string;
   firstName:string;
   middleName:string;
   lastName:string;
   fatherName:string;
   panNo:string;
   email:string;
   dob:Date;
   street : string;
   city:string;
   state:string;
   pinCode:number;
   gstId:string;
   gstPassword:string;
   incomeTaxId:string;
   incomeTaxPassword:string;
   fullName : string;
   totalFees :number;
   feesPaid :number;
   balanceAmount :number;
   discountOffered:number;
   lastPaymentReceivedDate:Date;
}

export class Address {
   flatNumber:string;
   street : string;
   city:string;
   state:string;
   pincode:string;
}
