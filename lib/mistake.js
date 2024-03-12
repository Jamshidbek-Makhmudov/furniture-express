class Definer {
  //general errors
  static general_err1 = "att: something went wrong!";
  static general_err2 = "att: there is no data with that params!";
  static general_err3 = "att: file upload error!";

  // member auth related
  static auth_err2 = "att: no member with that mb_nick";
  static auth_err3 = "att: your credentials do not match";
  static auth_err4 = "att: jwt token creation error";
  static auth_err5 = "att: You are not authentificated";

  //product errors
  static product_err1 = "att: product creation is failed!";
  static product_err2 = "att: there is no data with that params!";
  static product_err3 = "att: file upload error!";

  //order errors
  static order_err1 = "att: order creation is failed!";
  static order_err2 = "att: order item creation is failed!";
  static order_err3 = "att: no orders with that params exist!";

  //articles errors
  static article_err1 = "att: auther member for articles not provided !";
  static article_err2 = "att: no article found for that member!";
  static article_err3 = "att: no article found for that target!";

  //follow errors
  static follow_err1 = "att: self subscribtion is denied!";
  static follow_err2 = "att: new follow subscribtion is failed!";
  static follow_err3 = "att: no follow data found!";

  //mongodb validation
  static mongo_validation_err1 = "att: mongobd is failed";

  //event
  static event_err1 = "att: product creation is failed!";
}

module.exports = Definer;
