import * as components from "./components";
export * from './components';

const installer = (app) => {
  Object.keys(components).forEach((key) => {
    const comp = components[key];
    console.log(comp);
    if (comp.install) {
      comp.install(app);
    } else {
      app.component(key, components[key]);
    }
  });
};

export default installer;
