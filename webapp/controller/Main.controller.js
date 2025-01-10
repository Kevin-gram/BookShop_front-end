sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/model/Sorter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, JSONModel, MessageToast, Sorter, Filter, FilterOperator) {
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
            if (this._orderDialog) {
                this._orderDialog.close();
            }
        },

        onSubmitOrder: function () {
            var oModel = this.getView().getModel();
            var oBook = oModel.getProperty("/selectedBook");
            var sQuantity = this.byId("quantity").getValue();

            // Here you can implement the logic to place an order
            // For demonstration, we will just show a message toast
            MessageToast.show("Order placed for: " + oBook.title + " with quantity: " + sQuantity);

            if (this._orderDialog) {
                this._orderDialog.close();
            }
        },

        onCancelOrder: function () {
            if (this._orderDialog) {
                this._orderDialog.close();
            }
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

            var oNewBook = {
                title: sTitle,
                descr: sDescription,
                price: sPrice,
                currency_code: sCurrency,
                rating: 0  // Initialize rating to 0
            };

            fetch("http://localhost:4004/odata/v4/admin/createBook", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(oNewBook)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                MessageToast.show("Book created: " + data.title);
                this._fetchBooks();  // Fetch the updated list of books
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });

            if (this._createBookDialog) {
                this._createBookDialog.close();
            }
        },

        onCancelCreateBook: function () {
            if (this._createBookDialog) {
                this._createBookDialog.close();
            }
        },

        onSortByPrice: function () {
            var oTable = this.byId("booksTable");
            var oBinding = oTable.getBinding("items");
            var oSorter = new Sorter("price", false);  // Sort by price in ascending order
            oBinding.sort(oSorter);
        },

        onSortByCurrency: function () {
            var oTable = this.byId("booksTable");
            var oBinding = oTable.getBinding("items");
            var oSorter = new Sorter("currency_code", false);  // Sort by currency in ascending order
            oBinding.sort(oSorter);
        },

        onSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue");
            var aFilters = [];
            if (sQuery && sQuery.length > 0) {
                aFilters.push(new Filter("title", FilterOperator.Contains, sQuery));
            }
            var oTable = this.byId("booksTable");
            var oBinding = oTable.getBinding("items");
            oBinding.filter(aFilters);
        },

        onRatingChange: function (oEvent) {
            var oItem = oEvent.getSource().getParent().getParent();
            var oContext = oItem.getBindingContext();
            var oModel = this.getView().getModel();
            var oBook = oContext.getObject();
            var iRating = oEvent.getParameter("value");

            // Update the rating in the model
            oBook.rating = iRating;
            oModel.refresh();
        }
    });
});