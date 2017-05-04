function GridView(options) {
    let that = this,
		db = options.db,
		entity = options.entity,

		data = options.data,
		modelList = options.modelList,
		model = options.model,
		newID = 1,

		$grid = $('<table>', { 'class': 'container' }),
		$gHead = $('<thead>'),
		$gBody,
		$gFoot = $('<tfoot>'),

		editBtn,
		removeBtn,
		newBtn,
		saveBtn,
		cols = options.cols,
		sortState = true,
		gridMode = GridView.GRID_MODE.VIEW,
		iValArr = [],
        editBtns = [],
        saveBtns = [],
        cancelBtns = [];

    //console.log(cols);

    this.initHead = () => {
        let $gHeadRow = $('<tr>'),
			editTh = $('<th>', { text: 'Edit', title: 'Edit' }),
			removeTh = $('<th>', { text: 'Remove', title: 'Remove' });

        $gHeadRow.append(editTh);
        for (let i = 0; i < cols.length; i++) {
            let col = cols[i],
				cap = col.cap,
				isSortable = col.isSortable,
				tooltip = col.alt,
				colOptions = { text: cap, title: tooltip };

            if (isSortable) {
                colOptions.click = () => {
                    var option = $(this);

                    option.find('img').remove();

                    data = data.sortList(data, sortState ? BaseModelList.ASC : BaseModelList.DESC, col.name);

                    option.append($('<img>').addClass('sort_' + (sortState ? 'down' : 'up')));

                    sortState = !sortState;
                    that.loadGrid();
                };
            }
            gCol = $('<th>', colOptions);

            $gHeadRow.append(gCol);
        }
        $gHeadRow.append(removeTh);
        $gHead.append($gHeadRow);
        $grid.append($gHead);
    };

    this.initGrid = () => {
        //??
        data = new modelList({ model: model, db: db, entity: entity });
        this.loadGrid();
    };

    this.loadGrid = () => {
        let $gBody = $('<tbody>');

        data.forEach((item, i) => {
            let row = $('<tr>'),
				editTd = $('<td>'),
				removeTd = $('<td>'),
                editBtn = $('<input>', { type: 'image', 'class': 'editBtn', title: 'Edit', alt: ' ' }),
                saveBtn = $('<input>', { type: 'image', 'class': 'saveBtn', title: 'Save', alt: ' ' }).css('display', 'none'),
                cancelBtn = $('<input>', { type: 'image', 'class': 'cancelBtn', title: 'Cancel', alt: ' ' }).css('display', 'none'),
                removeBtn = $('<input>', { type: 'image', 'class': 'removeBtn', title: 'Remove', alt: ' ' });

            editBtns.push(editBtn);
            saveBtns.push(saveBtn);
            cancelBtns.push(cancelBtn);

            row.append(editTd.append(editBtn, saveBtn, cancelBtn));

            removeBtn.on('click', () => {
                let rb = $(this);
                if (confirm(MESSAGES.DELETE_ROW)) {
                    let pk = rb.closest('tr').find('span').text();
                    rb.closest('tr').remove();
                    data.delete(pk);
                }
            });

            for (let j = 0; j < cols.length; j++) {
                let col = cols[j],
					text = item[col.name],
					tooltip = item[col.tooltip],
					tempText = Function.isFunction(col.temp) ? col.temp(item) : col.temp,
					temp = Function.isFunction(col.temp) ? $(tempText) : $(tempText).text(text).attr({ title: tooltip }),
					cell = $('<td>').append(temp);

                row.append(cell);
                row.append(removeTd.append(removeBtn));
            }
            $gBody.append(row);
        });








        $(editBtns).each((i, item) => {
            let $item = $(item);

            $item.on('click', () => {
                edit($item);                
            })
        });

        $(saveBtns).each((i, item) => {
            let $item = $(item);

            $item.on('click', () => {
                save($item)
            })
        });

        $(cancelBtns).each((i, item) => {
            let $item = $(item);

            $item.on('click', () => {
                cancel($item);
            })
        });






        $grid.find('tbody').remove();
        $grid.append($gBody).append($gFoot);
    };
    
    this.initFoot =  () => {

        let $gBody = $grid.find('tbody'), $gFootRow = $('<tr>'),
            newID = Object.keys(data).length,
            newBtn = $('<input>', { type: 'image', 'class': 'newBtn', title: 'New', alt: ' ' });

        $gFootRow.append($('<td>').append(newBtn));


        //console.log(Object.keys(data));
        newBtn.on('click', () => {
            if (gridMode == GridView.GRID_MODE.EDIT) return;
            $gBody.prepend(newIDs());
            //gridMode = GridView.GRID_MODE.EDIT;
            //console.log('NEW', gridMode);
        });

        $gFoot.append($gFootRow);
        $grid.append($gFoot);
    };






        newIDs = () => {
            let $row = $('<tr>'),
                editBtn = $('<input>', { type: 'image', 'class': 'editBtn', title: 'Edit', alt: ' ' }).css('display', 'none'),
                saveBtn = $('<input>', { type: 'image', 'class': 'saveBtn', title: 'Save', alt: ' ' }),
                cancelBtn = $('<input>', { type: 'image', 'class': 'cancelBtn', title: 'Cancel', alt: ' ' }),
                removeBtn = $('<input>', { type: 'image', 'class': 'removeBtn', title: 'Remove', alt: ' ' }),
                item = Object.keys(data)[Object.keys(data).length - 1];

            saveBtns.push(saveBtn);
            cancelBtns.push(cancelBtn);

            for (let j = 0; j < cols.length; j++) {
                let col = cols[j],
					text = item[col.name],
					editTempText = Function.isFunction(col.editTemp) ? col.editTemp(item) : col.editTemp,

			        editTemp = Function.isFunction(col.editTemp) ? $(editTempText) :
						$(editTempText)
							.attr({
							    type: 'ID' == col.name ? 'hidden' : 'text',
							    maxlength: 'CountryCode' == col.name ? 2 : 46,
							    name: col.name,
							    value: 'ID' == col.name ? newID++ : ''
							})
							.css({
							        height: '80%',
							        width: '90%',
							        'text-transform': 'CountryCode' == col.name ? 'uppercase' : 'capitalize'
                            }),
                    cell = $('<td>').append(editTemp);

                $row.append(cell);
                gridMode = !GridView.GRID_MODE.EDIT;
                //console.log('NEW', gridMode);
            }
            $row
                .prepend($('<td>')
                    .append(editBtn, saveBtn, cancelBtn))
                .append($('<td>')
                    .append(removeBtn));


            saveBtn.on('click', () => {
                save($(this))
                //let inputs = $(saveBtn.closest('tr')).find(':text');
                //    for (let j = 0; j < inputs.length; j++) {

                //        let $input = $(inputs[j]),
                //            iText = $input.val(),
                //            $i = $('<i>', { title: iText, text: iText });

                //        $input.parent().empty().append($i);
                //    }

                //arr = arr.splice(2);

                //saveBtn.parent().find('.saveBtn').css('display', 'none');
                //saveBtn.parent().find('.cancelBtn').css('display', 'none');
                //saveBtn.parent().find('.editBtn').css('display', 'inline-block');

            
            })
            return $row;
            
        };







    var arr = [];

    edit = (elem) => {
        let isEditable = false;

        $('.saveBtn').each((i, item) => {
            if ('inline-block' == $(item).css('display')) {
                isEditable = true;
            }
        });
        if (true == isEditable) {
            isEditable = false;
            return;
        }
        let $Is = $(elem.closest('tr')).find('i'),
            iLen = $Is.length,
            iValArr = [],
            saveBtn = $(elem.closest('td')).find('.saveBtn').css('display', 'inline-block'),
            cancelBtn = $(elem.closest('td')).find('.cancelBtn').css('display', 'inline-block');

        //console.log(iLen);

        for (let j = 0; j < iLen; j++) {
            let col = cols[j+1],
                $i = $($Is[j]),
                iText = $i.text();
            console.log(iText);
            arr.push(iText);

            $i.parent().empty()
                .append($('<input>', { type: 'text' })
                    .val(iText)
                    .attr({
                        type: 'ID' == col.name ? 'hidden' : 'text',
                        maxlength: 'CountryCode' == col.name ? 2 : 46,
                        name: col.name,
                        value: 'ID' == col.name ? newID++ : ''
                    })
                    .css({
                        height: '80%',
                        width: '90%',
                        'text-transform': 'CountryCode' == col.name ? 'uppercase' : 'capitalize'
                    }));

        }

        elem.css('display', 'none');


    };

    save = (elem) => {
        let inputs = $(elem.closest('tr')).find(':text');
        console.log(inputs);
        for (let j = 0; j < inputs.length; j++) {

            let col = cols[j+1],
                str = /^\s*$/,
                $input = $(inputs[j]),
                iText = $input.val(),
                $i = $('<i>', { title: iText, text: iText }).css({
                    height: '80%',
                    width: '90%',
                    'text-transform': 'CountryCode' == col.name ? 'uppercase' : 'capitalize'
                });

            if(str.test(iText) ) {
                alert(MESSAGES.INPUT_VAL);
                return;
            }
                

            $input.parent().empty().append($i);
        }

        arr = arr.splice(2);
        var td = elem.parent();
        td.find('.saveBtn, .cancelBtn').each(function(){
            $(this).css('display', 'none');
        });
       
        td.find('.editBtn').css('display', 'inline-block');

    };

    cancel = (elem) => {

        let inputs = $(elem.closest('tr')).find(':text');
        for (let j = 0; j < inputs.length; j++) {

            let $input = $(inputs[j])
            iText = arr[j],
            $i = $('<i>', { title: iText, text: iText });

            $input.parent().empty().append($i);
        }

        arr = arr.splice(2);

        elem.parent().find('.saveBtn').css('display', 'none');
        elem.parent().find('.cancelBtn').css('display', 'none');
        elem.parent().find('.editBtn').css('display', 'inline-block');

    };

    this.initHead();
    this.initGrid();
    this.initFoot();


    return $grid;
}

GridView.GRID_MODE = {
    VIEW: true,
    EDIT: false
};