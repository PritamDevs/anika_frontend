// import { useState } from "react";
// import AddEditProduct from "./AddEditProduct";

// const Products = () => {
//   // 1. Set to empty array for a blank start
//   const [products, setProducts] = useState([]); 

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editProduct, setEditProduct] = useState(null);

//   /* ---- Handlers ---- */

//   const handleAddClick = () => {
//     setEditProduct(null);
//     setIsModalOpen(true);
//   };

//   const handleEditClick = (product) => {
//     setEditProduct(product);
//     setIsModalOpen(true);
//   };

//   const handleDelete = (id) => {
//     if (!window.confirm("Are you sure you want to delete this product?")) return;
//     setProducts(products.filter((p) => p.id !== id));
//   };

//   const handleSaveProduct = (data) => {
//     if (editProduct) {
//       // Update existing
//       setProducts(
//         products.map((p) =>
//           p.id === editProduct.id ? { ...data, id: p.id } : p
//         )
//       );
//     } else {
//       // Add new - This allows the list to grow indefinitely
//       setProducts([
//         ...products,
//         {
//           ...data,
//           id: Date.now(), // Unique ID for every new entry
//         },
//       ]);
//     }
//     setIsModalOpen(false); // Close modal after saving
//   };

//   return (
//     <div style={styles.container}>
//       {/* Header */}
//       <div style={styles.header}>
//         <div>
//           <h2 style={styles.heading}>Product List</h2>
//           <p style={styles.subheading}>Manage your Ice Cream Inventory</p>
//         </div>

//         <div style={styles.headerRight}>
//           <div style={styles.searchWrapper}>
//             <input
//               type="text"
//               placeholder="Search Product by Name"
//               style={styles.search}
//             />
//             <span style={styles.searchIcon}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg> </span>
//           </div>
//           <button style={styles.addButton} onClick={handleAddClick}>
//             + Add Product
//           </button>
//         </div>
//       </div>

//       {/* Table Container */}
//       <div style={styles.tableWrapper}>
//         <table style={styles.table}>
//           <thead>
//             <tr>
//               <th style={styles.th}>SL.</th>
//               <th style={styles.th}>Product</th>
//               <th style={styles.th}>Batch No.</th>
//               <th style={styles.th}>Rate</th>
//               <th style={styles.th}>Discount %</th>
//               <th style={styles.th}>Stock Qty</th>
//               <th style={styles.th}>Date</th>
//               <th style={{ ...styles.th, textAlign: "center" }}>Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {products.map((product, index) => (
//               <tr key={product.id}>
//                 <td style={styles.td}>{index + 1}</td>
//                 <td style={styles.td}>{product.name}</td>
//                 <td style={styles.td}>{product.batchNo}</td>
//                 <td style={styles.td}>₹ {Number(product.rate).toFixed(2)}</td>
//                 <td style={styles.td}>{product.discount}%</td>
//                 <td style={styles.td}>{product.stock}</td>
//                 <td style={styles.td}>{product.date}</td>
//                 <td style={styles.actionCell}>
//                   <button
//                     style={styles.editBtn}
//                     onClick={() => handleEditClick(product)}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
//                   </button>
//                   <button
//                     style={styles.deleteBtn}
//                     onClick={() => handleDelete(product.id)}
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Feedback when list is empty */}
//         {products.length === 0 && (
//           <div style={styles.emptyState}>
//             <p>No products added yet. Click "+ Add Product" to begin.</p>
//           </div>
//         )}
//       </div>

//       <AddEditProduct
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSave={handleSaveProduct}
//         initialData={editProduct}
//       />
//     </div>
//   );
// };

// /* ---- Updated Styles for the UI in image ---- */

// const styles = {
//   container: {
//     padding: "40px",
//     backgroundColor: "#f0f4f8",
//     minHeight: "100vh",
//   },
//   header: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: "30px",
//   },
//   headerRight: {
//     display: "flex",
//     gap: "20px",
//     alignItems: "center",
//   },
//   heading: { margin: 0, fontSize: "28px", fontWeight: "700" },
//   subheading: { margin: 0, color: "#64748b", fontSize: "14px" },
//   searchWrapper: { position: "relative" },
//   search: {
//     padding: "10px 15px",
//     width: "250px",
//     borderRadius: "20px",
//     border: "1px solid #cbd5e1",
//     outline: "none",
//   },
//   searchIcon: { position: "absolute", right: "12px", top: "10px", color: "#94a3b8" },
//   addButton: {
//     padding: "10px 20px",
//     backgroundColor: "#40b5ad",
//     color: "white",
//     border: "none",
//     borderRadius: "8px",
//     cursor: "pointer",
//     fontWeight: "600",
//   },
//   tableWrapper: {
//     backgroundColor: "#d1dee2", // The specific blue-grey from your image
//     borderRadius: "12px",
//     padding: "20px",
//     minHeight: "400px", // Keeps the UI consistent even when empty
//   },
//   table: { width: "100%", borderCollapse: "collapse" },
//   th: {
//     textAlign: "left",
//     padding: "12px",
//     borderBottom: "1px solid #94a3b8",
//     color: "#334155",
//     textTransform: "uppercase",
//     fontSize: "12px",
//     letterSpacing: "0.05em",
//   },
//   td: {
//     padding: "15px 12px",
//     borderBottom: "1px solid #94a3b8",
//     fontSize: "14px",
//     color: "#1e293b",
//   },
//   actionCell: {
//     display: "flex",
//     gap: "10px",
//     justifyContent: "center",
//     padding: "15px 12px",
//     borderBottom: "1px solid #94a3b8",
//   },
//   editBtn: {
//     backgroundColor: "#4fd1c5",
//     border: "none",
//     padding: "6px 10px",
//     borderRadius: "4px",
//     cursor: "pointer",
//   },
//   deleteBtn: {
//     backgroundColor: "#4fd1c5",
//     border: "none",
//     padding: "6px 10px",
//     borderRadius: "4px",
//     cursor: "pointer",
//   },
//   emptyState: {
//     textAlign: "center",
//     padding: "100px 0",
//     color: "#64748b",
//     fontSize: "16px",
//   },
// };

// export default Products;

import { useEffect, useState } from "react";
import AddEditProduct from "./AddEditProduct";
import { BACKEND_URL } from "../../config/index.js";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");


  const token = localStorage.getItem("token");

  /* =====================
     FETCH PRODUCTS
  ===================== */
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setProducts(data);
    } catch {
      alert("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* =====================
     HANDLERS
  ===================== */
  const handleAddClick = () => {
    setEditProduct(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (product) => {
    setEditProduct({
      ...product,
      stock: product.stockQty, 
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await fetch(`${BACKEND_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchProducts();
    } catch {
      alert("Delete failed");
    }
  };

 const handleSaveProduct = async (data) => {
  try {
    // 🔁 EDIT MODE → UPDATE
    if (editProduct) {
      await fetch(`${BACKEND_URL}/api/products/${editProduct._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: data.name,
          rate: data.rate,
          discount: data.discount,
          stockQty: data.stock,
        }),
      });
    } 
    // ➕ ADD MODE → CREATE
    else {
      await fetch(`${BACKEND_URL}/api/products/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: data.name,
          rate: data.rate,
          discount: data.discount,
          stockQty: data.stock,
        }),
      });
    }

    setIsModalOpen(false);
    setEditProduct(null);
    fetchProducts();
  } catch {
    alert("Save failed");
  }
};

  const filteredProducts = products.filter((p) =>
  p.name.toLowerCase().includes(searchTerm.toLowerCase())
);


  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>

        <div>
          <h2 style={styles.heading}>Product List</h2>
          <p style={styles.subheading}>Manage your Ice Cream Inventory</p>
        </div>


        <div style={styles.headerRight}>
           <div style={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Search Product by Name"
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.search}
            />
            <span style={styles.searchIcon}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg> </span>
          </div>
          <button style={styles.addButton} onClick={handleAddClick}>
            + Add Product
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>SL</th>
              <th style={styles.th}>Product</th>
              <th style={styles.th}>Rate</th>
              <th style={styles.th}>Discount %</th>
              <th style={styles.th}>Stock</th>
              <th style={{ ...styles.th, textAlign: "center" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((p, i) => (
              <tr key={p._id}>
                <td style={styles.td}>{i + 1}</td>
                <td style={styles.td}>{p.name}</td>
                <td style={styles.td}>₹ {p.rate}</td>
                <td style={styles.td}>{p.discount || 0}%</td>
                <td style={styles.td}>{p.stockQty}</td>
                <td style={styles.actionCell}>
                  <button
                    style={styles.editBtn}
                    onClick={() => handleEditClick(p)}
                  >
                    ✏️
                  </button>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(p._id)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div style={styles.emptyState}>
            No products found
          </div>
        )}
      </div>

      <AddEditProduct
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        initialData={editProduct}
      />
    </div>
  );
};

/* =====================
   STYLES (UNCHANGED)
===================== */
const styles = {
  // container: {
  //   padding: "40px",
  //   backgroundColor: "#f0f4f8",
  //   minHeight: "100vh",
  // },
  container: {
  padding: "40px",
  backgroundColor: "#f0f4f8",
  minHeight: "100vh",
  width: "100%",
  overflowX: "hidden",
},
  // header: {
  //   display: "flex",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   marginBottom: "30px",
  // },
  header: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "15px",
  marginBottom: "30px",
},
  // headerRight: {
  //   display: "flex",
  //   gap: "20px",
  //   alignItems: "center",
  // },
  headerRight: {
  display: "flex",
  gap: "15px",
  alignItems: "center",
  flexWrap: "wrap",
},
  heading: { margin: 0, fontSize: "28px", fontWeight: "700" },
  subheading: { margin: 0, color: "#64748b" },
  // searchWrapper: { position: "relative" },
  searchWrapper: {
  position: "relative",
  width: "100%",
  maxWidth: "250px",
},
  search: {
    padding: "10px 15px",
    width: "250px",
    maxWidth: "250px",
    borderRadius: "20px",
    border: "1px solid #cbd5e1",
    outline: "none",
  },
  searchIcon: { position: "absolute", right: "12px", top: "10px", color: "#94a3b8" },
  addButton: {
    padding: "10px 20px",
    backgroundColor: "#40b5ad",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },
  // tableWrapper: {
  //   backgroundColor: "#d1dee2",
  //   borderRadius: "12px",
  //   padding: "20px",
  // },
  tableWrapper: {
  backgroundColor: "#d1dee2",
  borderRadius: "12px",
  padding: "20px",
  overflowX: "auto",
},
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    textAlign: "center",
  padding: "12px",
  borderBottom: "1px solid #94a3b8",
  color: "#334155",
  textTransform: "uppercase",
  fontSize: "12px",
  letterSpacing: "0.05em",
  verticalAlign: "middle",
  },
  td: {
    padding: "15px 12px",
  borderBottom: "1px solid #94a3b8",
  fontSize: "14px",
  color: "#1e293b",
  textAlign: "center",
  verticalAlign: "middle",
  },
  actionCell: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    alignItems: "center",
    padding: "15px 12px",
    borderBottom: "1px solid #94a3b8",
  },
  editBtn: {
    backgroundColor: "#4fd1c5",
    border: "none",
    padding: "6px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  deleteBtn: {
    backgroundColor: "#4fd1c5",
    border: "none",
    padding: "6px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  emptyState: {
    textAlign: "center",
    padding: "40px",
    color: "#64748b",
  },
};

export default Products;
