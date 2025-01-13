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
            var oModel = new JSONModel({
                value: [],
                skip: 0,
                limit: 10,
                orderStatus: "",
                selectedBook: {}
            });
            this.getView().setModel(oModel);
            this._fetchBooks();
        },

        _fetchBooks: function () {
            var oModel = this.getView().getModel();
            var iSkip = oModel.getProperty("/skip");
            var iLimit = oModel.getProperty("/limit");

            fetch(`http://localhost:3000/api/odata/v4/catalog/Books?$skip=${iSkip}&$top=${iLimit}`)  // Use proxy server
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.json();
                })
                .then(data => {
                    var aBooks = oModel.getProperty("/value");
                    aBooks = aBooks.concat(data.value);
                    oModel.setProperty("/value", aBooks);
                    oModel.setProperty("/skip", iSkip + iLimit);
                    console.log(data)
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
            var sQuantity = parseInt(this.byId("quantity").getValue(), 10);

            var oOrder = {
                items: [
                    {
                        book: oBook.ID,
                        quantity: sQuantity
                    }
                ]
            };

            // Log the request data to the console
            console.log("Order request data:", oOrder);

            fetch("http://localhost:3000/api/odata/v4/catalog/submitOrder", {  // Use proxy server
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(oOrder)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                MessageToast.show("Order placed successfully!");
                oModel.setProperty("/orderStatus", "Order placed successfully!");
                this._resetBooks();  // Reset the book list and fetch from the beginning
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
                MessageToast.show("Order failed!");
                oModel.setProperty("/orderStatus", "Order failed!");
            });

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
            var sPrice = parseFloat(this.byId("newBookPrice").getValue());
            var sCurrency = this.byId("newBookCurrency").getValue();
            var sStock = parseInt(this.byId("newBookStock").getValue(), 10);
            var sAuthorID = parseInt(this.byId("newBookAuthorID").getValue(), 10);
            var sGenreID = parseInt(this.byId("newBookGenreID").getValue(), 10);
            var sDescription = this.byId("newBookDescription").getValue();

            var oNewBook = {
                title: sTitle,
                price: sPrice,
                currency_code: sCurrency,
                stock: sStock,
                author_ID: sAuthorID,
                genre_ID: sGenreID,
                descr: sDescription
            };

            // Log the request data to the console
            console.log("Request data:", oNewBook);

            fetch("http://localhost:3000/api/odata/v4/admin/createBook", {  // Use proxy server
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
                this._resetBooks();  // Reset the book list and fetch from the beginning
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
        },

        formatDescription: function (sDescription) {
            if (sDescription && sDescription.length > 50) {
                return sDescription.substring(0, 50) + "...";
            }
            return sDescription;
        },

        onViewMorePress: function (oEvent) {
            var oItem = oEvent.getSource().getParent().getParent();
            var oContext = oItem.getBindingContext();
            var oBook = oContext.getObject();

            if (!this._descriptionPopover) {
                this._descriptionPopover = this.byId("descriptionPopover");
            }

            this.byId("fullDescription").setText(oBook.descr);
            this._descriptionPopover.openBy(oEvent.getSource());
        },

        onCloseViewMore: function () {
            if (this._descriptionPopover) {
                this._descriptionPopover.close();
            }
        },

        onBookPress: function (oEvent) {
            var oItem = oEvent.getSource();
            var oContext = oItem.getBindingContext();
            var oBook = oContext.getObject();

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("bookDetail", {
                bookId: oBook.ID
            });
        },

        _resetBooks: function () {
            var oModel = this.getView().getModel();
            oModel.setProperty("/value", []);
            oModel.setProperty("/skip", 0);
            this._fetchBooks();
        }
    });
});