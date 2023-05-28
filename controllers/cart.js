
const{errorCheck} = require ('../utils/errorCheck.js')
const {cartFactory} = require('../repository/cartFactory.js')


async function allCarts(req, res) {
  const result = await cartFactory.listAll();
  errorCheck(req, res, result)
}

async function cartById(req, res) {
  const result = await cartFactory.listById(req.params.id);
  errorCheck(req, res, result)
}

async function addCart(req, res) {
  const result = await cartFactory.createCart(req.body);
  errorCheck(req, res, result)
}

async function addProduct(req, res) {
  const result = await cartFactory.updateCart(req.body);
  errorCheck(req, res, result)
}

async function deleteCart(req, res) {
  const result = await cartFactory.removeCart(req.params.id);
  errorCheck(req, res, result)
}

async function removeProductById(req, res) {
  const result = await cartFactory.removeProduct(
    req.params.id,
    req.params.id_prod
  );
  errorCheck(req, res, result)
}

module.exports = {allCarts,cartById,addCart,addProduct,deleteCart,removeProductById,};
