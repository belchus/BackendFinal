module.exports = class ProductDTO {
    constructor (data) {
        this.data = data
    }
    allProducts() {
        if(this.data.error) {
            return this.data
        } else {
            const products = []
            this.data.forEach(product => {
                const thisproduct = {
                    id: product.id,
                    title: product.title,
                    description: product.description,
                    code: product.code,
                    thumbnail: product.thumbnail,
                    price: product.price,
                    stock: product.stock,
                }
                products.push(thisproduct)
            });
            return products
        }
    }

    product(){
        if(this.data.error){
            return this.data
        } else {
            const product = {
                id: product.id,
                title: product.title,
                description: product.description,
                code: product.code,
                thumbnail: product.thumbnail,
                price: product.price,
                stock: product.stock,
            }
            return product
        }
    }
}