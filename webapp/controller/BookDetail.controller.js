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
            this.getView().bindElement({
                path: "/value/" + sBookId
            });
        },

        onAddToCartPress: function () {
            MessageToast.show("Book added to cart!");
        }
    });
});