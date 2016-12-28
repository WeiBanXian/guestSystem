var Server = {

    setDomain: function (_domain) {
        this._domain = _domain;
    },

    getDomain: function () {
        var domain = this._domain;
        if (!domain) {
            return false;
        }
        var length = domain.length-1;
        if (domain[domain.length-1] == '/') {
            domain = domain.substring(0, length);
        }
        return domain;
    },

    setSelectedPurpose: function (_purpose) {
        this._purpose = _purpose;
    },

    getSelectedPurpose: function () {
        return this._purpose;
    },

    setHostData: function (_hostData) {
        this._hostData = _hostData;
    },

    getHostData: function () {
        return this._hostData;
    },

    setVisitor: function (_visitor) {
        this._visitor = _visitor;
    },

    getVisitor: function () {
        return this._visitor;
    },

    setVisitorPhone: function (_visitorPhone) {
        this._visitorPhone = _visitorPhone;
    },

    getVisitorPhone: function () {
        return this._visitorPhone;
    },

    setListHostsData: function (_listHostsData) {
        this._listHostsData = _listHostsData;
    },

    getListHostsData: function () {
        return this._listHostsData || [];
    },

    setListGuestPurposeData: function (_listGuestPurposeData) {
        this._listGuestPurposeData = _listGuestPurposeData;
    },

    getListGuestPurposeData: function () {
        return this._listGuestPurposeData || [];
    },

    requestListHosts: function (callback) {
        fetch(this.getDomain() + '/listHosts',
            {
                method: 'GET',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
        .then((response) => response.text())
        .then((responseText) => {
            var result = JSON.parse(responseText)
            this.setListHostsData(result.data);
            // console.log(responseText+"")
            callback && callback(result);
        })
        .catch((error) => {
            console.log(error);
        });
    },
    requestListGuestPurpose: function (callback) {
        fetch(this.getDomain() + '/listGuestPurpose',
            {
                method: 'GET',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
        .then((response) => response.text())
        .then((responseText) => {
            var result = JSON.parse(responseText)
            this.setListGuestPurposeData(result.data);
            console.log(responseText+"。。。。。。。。purpose")
            callback && callback(result);
        })
        .catch((error) => {
            console.log(error);
        });
    },
    guestForm: function (callback, failedCb) {
        var host = '未知';
        if (this.getHostData() != undefined && this.getHostData().name != undefined) {
            host = this.getHostData().name;
        }
        var email = '未知';
        var phone = '未知';
        if (this.getVisitorPhone() != undefined) {
            email = this.getVisitorPhone();
            phone = this.getVisitorPhone();
        }
        var url = this.getDomain() + '/guestForm?guestName='+
                this.getVisitor()+'&company=未知&email='+email+'&purpose='+
                this.getSelectedPurpose()+'&host='+host+'&phone='+phone;
        console.log(url)
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        })
        .then((response) => response.text())
        .then((responseText) => {
            var result = JSON.parse(responseText)
            if (result.status == 200) {
                callback && callback();
            } else {
                failedCb && failedCb();
            }
            // console.log(result);
        })
        .catch((error) => {
            console.warn(error);
        });
    },

    Filter: function (text) {
        var searchResult = [];
        var listHosts = this.getListHostsData();
        var searchResultLength = 0;
        if (/^[a-zA-Z]*$/.test(text)) {
            text = text.toLowerCase();
            for (var i in listHosts) {
                if (listHosts[i].account != undefined) {
                    if (listHosts[i].account.indexOf(text) > -1) {
                        searchResult.push(listHosts[i]);
                        searchResultLength ++;
                    }
                }
                if (searchResultLength > 5) {
                    break;
                }
            }
        } else if (/^[\u4e00-\u9fa5]*$/.test(text)) {
            for (var i in listHosts) {
                if (listHosts[i].name != undefined) {
                    if (listHosts[i].name.indexOf(text) > -1) {
                        searchResult.push(listHosts[i]);
                        searchResultLength ++;
                    }
                }
                if (searchResultLength > 5) {
                    break;
                }
            }
        }
        return searchResult;
    }
}

module.exports = Server;