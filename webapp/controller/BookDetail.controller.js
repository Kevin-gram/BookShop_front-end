sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("bookshop.controller.BookDetail", {
        onInit: function () {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("bookDetail").attachPatternMatched(this._onObjectMatched, this);
        },

        // Called when the route is matched, which happens when a book is selected.
        _onObjectMatched: function (oEvent) {
            var sBookId = oEvent.getParameter("arguments").bookId;
            console.log("Book ID:", sBookId);  // Log the book ID
            this._fetchBookDetails(sBookId);  // Fetch details of the book based on the ID
        },

        // Fetch book details from the API
        _fetchBookDetails: function (sBookId) {
            var oModel = this.getView().getModel();
            var sUrl = `http://localhost:3000/api/odata/v4/catalog/Books(${sBookId})`;
            console.log("Fetch URL:", sUrl);  // Log the fetch URL

            // Clear previous selectedBook data
            oModel.setProperty("/selectedBook", null);

            fetch(sUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("Fetched Data:", data);  // Log the fetched data
                    oModel.setProperty("/selectedBook", data);  // Set the data into the model's selectedBook property

                    // Ensure binding gets updated
                    this.getView().bindElement("/selectedBook");
                })
                .catch(error => {
                    console.error('There has been a problem with your fetch operation:', error);
                });
        },

        onAddToCartPress: function () {
            MessageToast.show("Book added to cart!");
        }
    });
});
