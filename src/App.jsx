import { useState } from 'react';
import './App.css';

function App() {
  const [itemRows, setItemRows] = useState([]);
  const [addItemDialog, setAddItemDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });

  const [title, setTitle] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [minimumReq, setMinimumReq] = useState('');
  const [unit, setUnit] = useState('');

  // Handle adding a new item
  const handleAddItem = () => {
    const qty = Number(quantity);
    const price = Number(unitPrice);
    const minReq = Number(minimumReq);

    if (!title || isNaN(qty) || isNaN(price) || isNaN(minReq)) {
      alert('Please enter valid values.');
      return;
    }

    const totalPrice = qty * price;

    setItemRows([
      ...itemRows,
      {
        title,
        quantity: qty,
        unitPrice: price,
        minimumReq: minReq,
        totalPrice,
        unit,
      },
    ]);

    // Reset inputs
    setTitle('');
    setQuantity('');
    setUnitPrice('');
    setMinimumReq('');
    setUnit('');

    // Close dialog
    setAddItemDialog(false);
  };

  // Handle search query change
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({ key, direction });
  };

  // Sort and filter the items based on search and sort settings
  const sortedItems = [...itemRows]
    .filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

  // Export data to CSV
  const exportToCSV = () => {
    const csvRows = [
      ['Title', 'Quantity', 'Unit Price', 'Minimum Required', 'Total Price', 'Unit'], // Header row
      ...sortedItems.map((item) => [
        item.title,
        item.quantity,
        item.unitPrice,
        item.minimumReq,
        item.totalPrice,
        item.unit,
      ]),
    ];

    const csvContent = csvRows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory.csv';
    a.click();
  };

  // Handle inline editing (for contenteditable)
  const handleInlineEdit = (index, field, value) => {
    const updatedItems = [...itemRows];
    updatedItems[index][field] = value;

    // Recalculate total price if quantity or unit price changes
    if (field === 'quantity' || field === 'unitPrice') {
      updatedItems[index].totalPrice = updatedItems[index].quantity * updatedItems[index].unitPrice;
    }

    setItemRows(updatedItems);
  };

  return (
    <>
      <main className="p-3">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search items"
          className="w-full focus:outline-none p-2 border border-gray-300 rounded-lg focus:border-blue-600 mb-4"
          value={searchQuery}
          onChange={handleSearch}
        />

        {/* Button to add an item */}
        <button
          className="py-2 border border-gray-300 text-gray-700 rounded-lg px-5 hover:border-blue-600 hover:text-blue-600 cursor-pointer"
          onClick={() => setAddItemDialog(true)}
        >
          Add
        </button>

        {/* Button to export to CSV */}
        <button
          className="py-2 border border-gray-300 text-gray-700 rounded-lg px-5 hover:border-blue-600 hover:text-blue-600 cursor-pointer ml-3"
          onClick={exportToCSV}
        >
          Export to CSV
        </button>

        {/* Dialog Box */}
        {addItemDialog && (
          <dialog
            className="w-[400px] h-[400px] p-5 border fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            open
          >
            <button onClick={() => setAddItemDialog(false)} className="absolute top-2 right-2">
              X
            </button>

            <strong>Add Item</strong>
            <br />
            <br />

            <input
              type="text"
              placeholder="Enter the name of the item"
              className="w-full focus:outline-none p-2 border border-gray-300 rounded-lg focus:border-blue-600"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <br />
            <br />
            <input
              type="number"
              placeholder="Enter the quantity"
              className="w-full focus:outline-none p-2 border border-gray-300 rounded-lg focus:border-blue-600"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <br />
            <br />
            <input
              type="number"
              placeholder="Enter the unit price (1 unit)"
              className="w-full focus:outline-none p-2 border border-gray-300 rounded-lg focus:border-blue-600"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
            />
            <br />
            <br />
            <input
              type="number"
              placeholder="Enter the minimum required quantity"
              className="w-full focus:outline-none p-2 border border-gray-300 rounded-lg focus:border-blue-600"
              value={minimumReq}
              onChange={(e) => setMinimumReq(e.target.value)}
            />
            <br />
            <br />
            <input
              type="text"
              placeholder="Enter unit (e.g., pieces, ml)"
              className="w-full focus:outline-none p-2 border border-gray-300 rounded-lg focus:border-blue-600"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            />
            <br />
            <br />

            <button
              onClick={handleAddItem}
              className="py-2 border border-gray-300 text-gray-700 rounded-lg px-5 hover:border-blue-600 hover:text-blue-600 cursor-pointer w-full"
            >
              Add Item
            </button>
          </dialog>
        )}

        {/* Table for Items */}
        <table className="w-full mt-5 border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th
                className="border p-2 cursor-pointer"
                onClick={() => handleSort('title')}
              >
                Name
              </th>
              <th
                className="border p-2 cursor-pointer"
                onClick={() => handleSort('quantity')}
              >
                Quantity
              </th>
              <th
                className="border p-2 cursor-pointer"
                onClick={() => handleSort('unitPrice')}
              >
                Unit Price
              </th>
              <th
                className="border p-2 cursor-pointer"
                onClick={() => handleSort('minimumReq')}
              >
                Minimum Required
              </th>
              <th
                className="border p-2 cursor-pointer"
                onClick={() => handleSort('totalPrice')}
              >
                Total Price
              </th>
              <th className="border p-2">Unit</th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((item, index) => (
              <tr key={index} className="text-center">
                <td
                  className="border p-2"
                  contentEditable
                  onBlur={(e) => handleInlineEdit(index, 'title', e.target.innerText)}
                >
                  {item.title}
                </td>
                <td
                  className="border p-2"
                  contentEditable
                  onBlur={(e) => handleInlineEdit(index, 'quantity', e.target.innerText)}
                >
                  {item.quantity}
                </td>
                <td
                  className="border p-2"
                  contentEditable
                  onBlur={(e) => handleInlineEdit(index, 'unitPrice', e.target.innerText)}
                >
                  {item.unitPrice}
                </td>
                <td
                  className="border p-2"
                  contentEditable
                  onBlur={(e) => handleInlineEdit(index, 'minimumReq', e.target.innerText)}
                >
                  {item.minimumReq}
                </td>
                <td
                  className="border p-2"
                  contentEditable
                  onBlur={(e) => handleInlineEdit(index, 'totalPrice', e.target.innerText)}
                >
                  {item.totalPrice}
                </td>
                <td
                  className="border p-2"
                  contentEditable
                  onBlur={(e) => handleInlineEdit(index, 'unit', e.target.innerText)}
                >
                  {item.unit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  );
}

export default App;
