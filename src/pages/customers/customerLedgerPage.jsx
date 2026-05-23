import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import {
   getCustomerLedger
} from "../../../services/customerLedgerService";

function CustomerLedgerPage() {

   const { id } = useParams();

   const [loading, setLoading] = useState(true);

   const [ledgerData, setLedgerData] =
      useState(null);

    const [
        manualAdjustment,
        setManualAdjustment
    ] = useState(0);

   useEffect(() => {

      fetchLedger();

   }, []);

   const fetchLedger = async () => {

      try {

         setLoading(true);

         const data =
            await getCustomerLedger(id);

         setLedgerData(data);
         setManualAdjustment(
              data.customer?.manualAdjustment || 0
          );

      } catch (error) {

         console.error(error);

      } finally {

         setLoading(false);
      }
   };

    const handleSavePreviousDue =
        async () => {

            try {

                await axios.put(
                    `http://localhost:5000/api/customers/${id}/previous-due`,
                    {
                        manualAdjustment:
                            Number(manualAdjustment)
                    }
                );

                alert("Previous due updated");

                fetchLedger();

            } catch (error) {

                console.error(error);

                alert(
                    error.response?.data?.message ||
                    "Failed to update previous due"
                );
            }
        };

    const handleRecalculate = async () => {

        try {

            const confirmRun = window.confirm(
                "Recalculate this customer?"
            );

            if (!confirmRun) return;

            await axios.post(
                `http://localhost:5000/api/customers/${id}/recalculate`
            );

            alert("Customer recalculated");

            fetchLedger();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Recalculation failed"
            );
        }
    };


   if (loading) {
      return <p>Loading ledger...</p>;
   }

   if (!ledgerData) {
      return <p>No ledger found</p>;
   }

   return (

      <div style={{ padding: "20px" }}>

         <h1>
            {ledgerData.customer?.name} Ledger
         </h1>

           <button onClick={handleRecalculate}>
               Recalculate Customer
           </button>

           <div
               style={{
                   marginBottom: "20px"
               }}
           >

               <label
                   style={{
                       fontWeight: "bold"
                   }}
               >
                   Previous Due Before ERP
               </label>

               <br />

               <input
                   type="number"
                   value={manualAdjustment}
                   onChange={(e) =>
                       setManualAdjustment(e.target.value)
                   }
                   style={{
                       padding: "8px",
                       width: "250px",
                       marginTop: "10px"
                   }}
               />

               <button
                   onClick={handleSavePreviousDue}
                   style={{
                       marginLeft: "10px",
                       padding: "8px 15px"
                   }}
               >
                   Save Previous Due
               </button>

           </div>

         <hr />
           <h3>
               Opening Balance:
               ₹
               {ledgerData.customer?.manualAdjustment || 0}
           </h3>

         <table
            border="1"
            cellPadding="10"
            width="100%"
         >

            <thead>

               <tr>

                  <th>Date</th>

                  <th>Type</th>

                  <th>Reference</th>

                  <th>Debit</th>

                  <th>Credit</th>

                  <th>Running Balance</th>

               </tr>

            </thead>

            <tbody>

               {ledgerData.ledger?.map(
                  (entry, index) => (

                  <tr key={index}>

                     <td>
                        {new Date(
                           entry.date
                        ).toLocaleDateString()}
                     </td>

                     <td>
                        {entry.type}
                     </td>

                     <td>
                        {entry.ref}
                     </td>

                     <td>
                        ₹{entry.debit}
                     </td>

                     <td>
                        ₹{entry.credit}
                     </td>

                     <td>
                        ₹{entry.runningBalance}
                     </td>

                  </tr>
               ))}

            </tbody>

         </table>

      </div>
   );
}

export default CustomerLedgerPage;