import Image from "next/image";
import styles from "./Products.module.css";

export default function Products () {

    const products = [
        {
            id: 0,
            name: "Chair",
            description: "A chair made from an auracaria tree from Brazil.",
            price: 99.99,
            imageUrl: "/products/chair.png"
        },
        {
            id: 1,
            name: "Table",
            description: "A table made from oak wood.",
            price: 199.99,
            imageUrl: "/products/table.png"
        }
    ]

    return (
        <div id={styles.productsList}>
            <h1>Products</h1>

            { products.map(product => (
                <div key={product.id} className="product">
                    <h2>{product.name}</h2>
                    <Image src={product.imageUrl} alt="Product Image" width={200} height={200} />
                    <p>{product.description}</p>
                    <p>Price: ${product.price}</p>
                </div>
            ))}
        </div>
    );
}