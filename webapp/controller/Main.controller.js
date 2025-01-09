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

            var oModel = this.getView().getModel();
            oModel.setProperty("/selectedBook", oBook);

            if (!this._orderDialog) {
                this._orderDialog = this.byId("orderDialog");
            }
            this._orderDialog.open();
        },

        onDialogClose: function () {
            this._orderDialog.close();
        },

        onSubmitOrder: function () {
            var oModel = this.getView().getModel();
            var oBook = oModel.getProperty("/selectedBook");
            var sQuantity = this.byId("quantity").getValue();

            // Here you can implement the logic to place an order
            // For demonstration, we will just show a message toast
            MessageToast.show("Order placed for: " + oBook.title + " with quantity: " + sQuantity);

            this._orderDialog.close();
        },

        onCancelOrder: function () {
            this._orderDialog.close();
        },

        onCreateBookPress: function () {
            if (!this._createBookDialog) {
                this._createBookDialog = this.byId("createBookDialog");
            }
            this._createBookDialog.open();
        },

        onSubmitCreateBook: function () {
            var sTitle = this.byId("newBookTitle").getValue();
            var sDescription = this.byId("newBookDescription").getValue();
            var sPrice = this.byId("newBookPrice").getValue();
            var sCurrency = this.byId("newBookCurrency").getValue();

            // Here you can implement the logic to create a new book
            // For demonstration, we will just show a message toast
            MessageToast.show("Book created: " + sTitle);

            this._createBookDialog.close();
        },

        onCancelCreateBook: function () {
            this._createBookDialog.close();
        }
    });
});