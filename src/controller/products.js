const {
    selectAllProduct,
    selectProduct,
    insertProduct,
    updateProduct,
    deleteProduct,
    countData,
    findId,
  } = require("../model/products");
  const commonHelper = require("../helper/common");
  
  const productController = {

    getAllProduct: async(req, res) => {
      try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const offset = (page - 1) * limit;
        let sortBY = req.query.sortBY || "name";
        let sort = req.query.sort || 'ASC';
        let searchParam = req.query.search || "";
        const result = await selectAllProduct(limit, offset, searchParam,sortBY,sort);
        const {
          rows: [count],
        } = await countData();
        const totalData = parseInt(count.count);
        const totalPage = Math.ceil(totalData / limit);
        const pagination = {
          currentPage: page,
          limit: limit,
          totalData: totalData,
          totalPage: totalPage,
        };
        commonHelper.response(res , result.rows, 200, "get data success",pagination);
      } catch (error) {
        console.log(error);
      }
    },

    getDetailProduct: async (req, res) => {
      const id = Number(req.params.id);
      selectProduct(id)
        .then((result) => {
          commonHelper.response(res, result.rows, 200, "get data success");
        })
        .catch((err) => res.send(err));
    },


    createProduct: async (req, res) => {
      const { name, price, deskripsi, stock, rating, color, size, id_category, id_seller} = req.body;
      const {
        rows: [count],
      } = await countData();
      const id = Number(count.count) + 1;
      const data = {
        id,
        name,
        price,
        deskripsi,
        stock,
        rating,
        color,
        size,
        id_category,
        id_seller,
      };
      insertProduct(data)
        .then((result) =>
          commonHelper.response(res, result.rows, 201, "Product Telah dibuat")
        )
        .catch((err) => res.send(err));
    },

    updateProduct: async (req, res) => {
      try {
        const id = Number(req.params.id);
        const {name, price, deskripsi, stock, rating , color, size, id_category, id_seller} = req.body;
        const { rowCount } = await findId(id);
        if (!rowCount) {
          res.json({message: "ID is Not Found"})
        }
        const data = {
          id,
          name,
          price,
          deskripsi,
          stock,
          rating,
          color,
          size,
          id_category,
          id_seller,
        };
        updateProduct(data)
          .then((result) =>
            commonHelper.response(res, result.rows, 200, "Product Telah diupdate")
          )
          .catch((err) => res.send(err));
      } catch (error) {
        console.log(error);
      }
    },

    deleteProduct: async (req, res) => {
      try {
        const id = Number(req.params.id);
        const { rowCount } = await findId(id);
        if (!rowCount) {
          res.json({message: "ID Tidak ditemukan"})
        }
        deleteProduct(id)
          .then((result) =>
            commonHelper.response(res, result.rows, 200, "Product Telah dihapus")
          )
          .catch((err) => res.send(err));
      } catch (error) {
        console.log(error);
      }
    },
  };
  
  module.exports = productController;