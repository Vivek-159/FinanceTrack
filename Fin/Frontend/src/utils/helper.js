import moment from "moment";

export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const getInitials = (fullName) => {
    if (!fullName) return "";
    const names = fullName.split(" ");
    if (names.length === 1) {
        return names[0].charAt(0).toUpperCase();
    }
    return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
}

export const addThousendsSeparator = (num) => {
    if (num == null || isNaN(num)) return "";

    const [integerPart, FractionalPart] = num.toString().split(".");
    const formatedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return FractionalPart ? `${formatedInteger}.${FractionalPart}` : formatedInteger;
}

export const prepareExpenseBarChartData = ( data = [] ) => {
    const chartData = data.map((item) => ({
        catagory: item?.catagory,
        amount: item?.amount,
    }));
    return chartData;
};

export const prepareIncomeChartData = (data = []) => {
    const sortedData = [...data].sort((a,b)=> new Date(a.date)- new Date(b.date));

    const chartData = sortedData.map((item)=> ({
        month:moment(item?.date).format('Do MMM'),
        amount: item?.amount,
        source: item?.source,
    }));
    return chartData;
};
