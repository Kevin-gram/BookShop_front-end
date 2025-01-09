sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (Controller, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("bookshop.controller.Main", {
        onInit: function () {
            var oModel = new JSONModel();
            this.getView().setModel(oModel);
            this._fetchBooks();
        },

        _fetchBooks: function () {
            var oModel = this.getView().getModel();
            fetch("http://localhost:4004/odata/v4/catalog/Books")  // Direct link to the backend service
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.json();
                })
                .then(data => {
                    oModel.setData(data);
                })
                .catch(error => {
                    console.error('There has been a problem with your fetch operation:', error);
                });
        },

        onOrderPress: function (oEvent) {
            var oItem = oEvent.getSource().getParent();
            var oContext = oItem.getBindingContext();
            var oBook = oContext.getObject();

            // Here you can implement the logic to place an order
            // For demonstration, we will just show a message toast
            MessageToast.show("Order placed for: " + oBook.title);
        }
    });
});