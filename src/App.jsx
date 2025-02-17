import { useState } from "react";
import "./App.css";
import InventoryChart from './InventoryChart'

function App() {
  const [itemRows, setItemRows] = useState([]);
  const [addItemDialog, setAddItemDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const [title, setTitle] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [minimumReq, setMinimumReq] = useState("");
  const [unit, setUnit] = useState("");
  const [selectedItems, setSelectedItems] = useState(new Set());

  const handleAddItem = () => {
    const qty = Number(quantity);
    const price = Number(unitPrice);
    const minReq = Number(minimumReq);

    if (!title || isNaN(qty) || isNaN(price) || isNaN(minReq)) {
      alert("Please enter valid values.");
      return;
    }

    const totalPrice = qty * price;

    setItemRows([
      ...itemRows,
      {
        id: Date.now(),
        title,
        quantity: qty,
        unitPrice: price,
        minimumReq: minReq,
        totalPrice,
        unit,
      },
    ]);

    // Reset inputs
    setTitle("");
    setQuantity("");
    setUnitPrice("");
    setMinimumReq("");
    setUnit("");
    setAddItemDialog(false);
  };

  const handleEditCell = (e, index, field) => {
    const updatedRows = [...itemRows];
    let newValue = e.target.innerText;

    if (["quantity", "unitPrice", "minimumReq"].includes(field)) {
      newValue = Number(newValue) || 0;
    }

    updatedRows[index][field] = newValue;

    if (field === "quantity" || field === "unitPrice") {
      updatedRows[index].totalPrice = updatedRows[index].quantity * updatedRows[index].unitPrice;
    }

    setItemRows(updatedRows);
  };

  const handleDeleteSelected = () => {
    setItemRows(itemRows.filter((item) => !selectedItems.has(item.id)));
    setSelectedItems(new Set());
  };

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    const sortedRows = [...itemRows].sort((a, b) => {
      if (a[field] < b[field]) return order === "asc" ? -1 : 1;
      if (a[field] > b[field]) return order === "asc" ? 1 : -1;
      return 0;
    });

    setItemRows(sortedRows);
    setSortField(field);
    setSortOrder(order);
  };

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Name,Quantity,Unit Price,Minimum Required,Total Price,Unit"]
        .concat(
          itemRows.map(
            (item) =>
              `${item.title},${item.quantity},${item.unitPrice},${item.minimumReq},${item.totalPrice},${item.unit}`
          )
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inventory_data.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <main className="p-3">

      {/* Heading Options (add, delete, export, search) */}
      <div className="flex gap-3 mb-3">

        {/* Button to Add a new item */}
        <button
          className="py-2 border border-gray-300 text-gray-700 rounded-lg px-5 hover:border-blue-600 hover:text-blue-600 cursor-pointer"
          onClick={() => setAddItemDialog(true)}
        >
          Add
        </button>

        {/* Button to delete the selected item rows */}
        <button
          className="py-2 border border-gray-300 text-red-700 rounded-lg px-5 hover:border-red-600 hover:text-red-600 cursor-pointer"
          onClick={handleDeleteSelected}
          disabled={selectedItems.size === 0}
        >
          Delete Selected
        </button>

        {/* Button to Export the data into a .csv file */}
        <button
          className="py-2 border border-gray-300 text-green-700 rounded-lg px-5 hover:border-green-600 hover:text-green-600 cursor-pointer"
          onClick={handleExportCSV}
        >
          Export CSV
        </button>

        {/* Search bar to search the item rows by their title property (item name) */}
        <input
          type="text"
          placeholder="Search..."
          className="border p-2 rounded-lg focus:w-[400px] transition transition-ease-in-out duration-300"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

      </div>


      {/* Adding the item popup dialog to take details for adding an item */}
      {addItemDialog && (
        <dialog
          className="w-[400px] p-5 border fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          open
        >
          <button
            onClick={() => setAddItemDialog(false)}
            className="absolute top-2 right-2"
          >
            X
          </button>
          <strong>Add Item</strong>
          <br />
          <br />
          <input
            type="text"
            placeholder="Enter the name of the item"
            className="w-full p-2 border rounded-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <br />
          <br />
          <input
            type="number"
            placeholder="Enter the quantity"
            className="w-full p-2 border rounded-lg"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <br />
          <br />
          <input
            type="number"
            placeholder="Enter the unit price"
            className="w-full p-2 border rounded-lg"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
          />
          <br />
          <br />
          <input
            type="number"
            placeholder="Enter the minimum required quantity"
            className="w-full p-2 border rounded-lg"
            value={minimumReq}
            onChange={(e) => setMinimumReq(e.target.value)}
          />
          <br />
          <br />
          <input
            type="text"
            placeholder="Unit (e.g., pcs, ml, kg)"
            className="w-full p-2 border rounded-lg"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          />
          <br />
          <br />

          {/* Final button to add the data */}
          <button
            onClick={handleAddItem}
            className="py-2 border rounded-lg px-5 w-full"
          >
            Add Item
          </button>
        </dialog>
      )}

      {/* Main data in tabular form */}
      <table className="w-full mt-5 border-collapse border border-gray-300">

        {/* Table heading */}
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">
              <input type="checkbox" />
            </th>
            {["title", "quantity", "unitPrice", "minimumReq", "totalPrice", "unit"].map((field) => (
              <th
                key={field}
                className="border p-2 cursor-pointer"
                onClick={() => handleSort(field)}
              >
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </th>
            ))}
          </tr>
        </thead>

        {/* Main Inventory Data in table */}
        <tbody>
          {itemRows.map((item, index) => {
            const status = item.quantity < item.minimumReq ? "Needs to issue more" : "In Stock";
            const statusColor = item.quantity < item.minimumReq ? "text-red-500" : "text-green-500";

            return (
              <tr key={index} className="text-center">
                <td className="border p-2" contentEditable onBlur={(e) => updateField(index, "title", e.target.innerText)}>
                  {item.title}
                </td>
                <td className="border p-2" contentEditable onBlur={(e) => updateField(index, "quantity", e.target.innerText)}>
                  {item.quantity}
                </td>
                <td className="border p-2" contentEditable onBlur={(e) => updateField(index, "unitPrice", e.target.innerText)}>
                  {item.unitPrice}
                </td>
                <td className="border p-2" contentEditable onBlur={(e) => updateField(index, "minimumReq", e.target.innerText)}>
                  {item.minimumReq}
                </td>
                <td className="border p-2">{item.totalPrice}</td>
                <td className={`border p-2 font-bold ${statusColor}`}>{status}</td>
              </tr>
            );
          })}
        </tbody>

      </table>


      {/* Chart for the data */}
      {itemRows.length > 0 && (
        <div className="mt-5 p-3 border rounded-lg">
          <h2 className="text-xl font-bold mb-2">Inventory Chart Quantity</h2>
          <InventoryChart data={itemRows} />
        </div>
      )}
    </main>
  );
}

export default App;
