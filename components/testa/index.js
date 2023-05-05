import testA from "./testa.vue";

testA.install = (app) => {
  app.component(testA.name, testA);
};

export default testA;
