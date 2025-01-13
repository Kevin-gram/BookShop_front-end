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

        _onObjectMatched: function (oEvent) {
            var sBookId = oEvent.getParameter("arguments").bookId;
            console.log("Book ID:", sBookId);  // Log the book ID
            this._fetchBookDetails(sBookId);
        },

        _fetchBookDetails: function () {
            var oModel = this.getView().getModel();
            var sUrl = `http://localhost:3000/api/odata/v4/catalog/Books(${sBookId})`;
            console.log("Fetch URL:", sUrl);  // Log the fetch URL

            fetch(sUrl)  // Use proxy server
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("Fetched Data:", data);  // Log the fetched data
                    oModel.setProperty("/selectedBook", data);
                    console.log("Model Updated:", oModel.getProperty("/selectedBook"));  // Log the updated model
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