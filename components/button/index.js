import Button from "./button";

Button.install = function (app) {
  app.component(Button.name, Button);
};

export default Button;

// export default {
//   install(app) {
//     app.component(button.name, button);
//   },
// };
