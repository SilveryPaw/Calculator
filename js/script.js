var array = "+-/*^√";

function take_an_example()
{
    let str = document.getElementById("example").value;
    if(check_correct(str))
    {
        var result = generate_array(str);    
    }
    else
    {
        var result = undefined;
        alert("Ошибка! Проверьте правильность написанного примера!");
    }
    if(result !== undefined)
    {
        let result_element = document.getElementById("result");
        result_element.innerHTML = "Example: " + str;
        document.getElementById("example").value = result;
    }
    else
    {
        alert("Ошибка! Проверьте правильность написанного примера!");
    }
}



function get_count(str, element)
{
    let re = new RegExp(`\\${element}`, 'g');
    return (str.match(re) || []).length;
}

function get_result(el1, el2, operation)
{
    el1 = parseFloat(el1);
    el2 = parseFloat(el2);
    switch(operation)
    {
        case '+':
            if(isNaN(el1) || isNaN(el2)) { return undefined; }
            return el1 + el2;
            break;
        case '-':
            if(isNaN(el2)) {return undefined;}
            if(isNaN(el1)) {return el2*(-1);}
            console.log(el1-el2);
            return el1 - el2;
            break;
        case '*':
            if(isNaN(el1) || isNaN(el2)) { return undefined; }
            return el1 * el2;
            break;
        case '/':
            if(isNaN(el1) || isNaN(el2)) { return undefined; }
            return el1 / el2;
            break;
        case '^':
            if(isNaN(el1) || isNaN(el2)) { return undefined; }
            return Math.pow(el1, el2);
            break;
        case '√':
            if(isNaN(el2)) { return undefined; }
            return Math.sqrt(el2);
            break;
    }
}

function get_index_brace(str, cur_index)
{
    count_brace = 1;
    while(cur_index < str.length)
    {
if((str.indexOf("(", cur_index) > str.indexOf(")", cur_index)) || 
        (str.indexOf("(", cur_index) == -1))
        {
            count_brace--;
            cur_index = str.indexOf(")", cur_index);
        }
        else
        {
            count_brace++;
            cur_index = str.indexOf("(", cur_index);
        }
        if(count_brace == 0)
        {
            return cur_index;
        }
        else
        {
            cur_index++;
        }
    }
}

function check_correct(arr)
{
    if((get_count(arr, "(") != get_count(arr, ")"))
    || (arr.lastIndexOf("(") > arr.lastIndexOf(")"))
    || (arr.indexOf(")") < arr.indexOf("(")))
    {
        return false;
    }
    return true;
}

function perform_operations(arr, operation)
{
    while(arr.indexOf(operation) != -1)
    {
        let i = arr.indexOf(operation);
        if(arr[i] == "√")
        {
            arr[i] = get_result(NaN, arr[i + 1], arr[i]);
            arr.splice(i + 1, 1);
        }
        else
        {
            arr[i] = get_result(arr[i - 1], arr[i + 1], arr[i]);
            arr.splice(i + 1, 1);
            arr.splice(i - 1, 1);
        }

        console.log(arr);
    }
    return arr;
}

function generate_array(str)
{
    console.log("String: " + str);
    var ex = [];
    let start = 0;
    let i = 0;
    while(i < str.length)                                   //разбиение по скобкам
    {
        if(array.indexOf(str[i]) != -1)
        {
            if(i != start){
            ex[ex.length] = str.substr(start, i - start);
            }
            ex[ex.length] = str[i];
            start = i + 1;
        }
        else if(str[i] == '(')
        {
            let last = get_index_brace(str, i + 1);
            ex[ex.length] = generate_array(str.substr(i + 1, last - i - 1));
            i = last;
            start = i + 1;
        }
        else if(i == str.length - 1)
        {
            ex[ex.length] = str.substr(start, str.length);
        }
        i++;
    }
    console.log(ex);
    ex = perform_operations(ex, "^");
    ex = perform_operations(ex, "√");
    while(ex.indexOf("*") != -1 || ex.indexOf("/") != -1)   //умножение/деление
    {
        let i;
        if(ex.indexOf("*") != -1 && ex.indexOf("/") != -1)
        {
            if(ex.indexOf("*") < ex.indexOf("/"))
            {
                i = ex.indexOf("*");
            }
            else
            {
                i = ex.indexOf("/");
            }

        }
        else if(ex.indexOf("*") != -1)
        {
            i = ex.indexOf("*");
        }
        else
        {
            i = ex.indexOf("/");
        }

        ex[i] = get_result(ex[i - 1], ex[i + 1], ex[i]);
        ex.splice(i + 1, 1);
        ex.splice(i - 1, 1);
    }
    while(ex.length > 1)
    {
        if(array.indexOf(ex[0]) != -1)
        {
            ex[1] = get_result(NaN, ex[1], ex[0])
        }
        else
        {
            ex[1] = get_result(ex[0], ex[2], ex[1]);
        }
        ex.splice(2, 1);
        ex.splice(0, 1);
    }
    return ex[0];
}
