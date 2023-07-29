class UserControllers {

    constructor(formId, tableId) {

        this.formEl = document.getElementById(formId)
        this.tableEl = document.getElementById(tableId)


        this.onSubmit();

    }


    onSubmit() {


        this.formEl.addEventListener("submit", (event) => {

            event.preventDefault();

            let btn = this.formEl.querySelector("[type=submit]")

            btn.disabled = true;

            let values = this.getValues();

            this.getPhoto().then(
                (content) => {
                    values.photo = content
                    this.addLine(values);
                    this.formEl.reset();
                    btn.disabled = false
                },
                function (e) {
                    console.error(e)
                }
            );

        });


    }

    getPhoto() {

        return new Promise((resolve, reject) => {

            let fileReader = new FileReader();

            let elements = [...this.formEl.elements].filter(item => {

                if (item.name === 'photo') {
                    return item;
                }
            });

            let file = elements[0].files[0]


            fileReader.onload = () => {

                resolve(fileReader.result);
            }

            fileReader.onerror = (e) => {

                reject(e)
            }

            if (file) {
                fileReader.readAsDataURL(file);
            } else {
                resolve('dist/img/boxed-bg.jpg')
            }
        })


    }

    getValues() {

        let user = {};
        let isValid = true;

        [...this.formEl.elements].forEach(function (doc, i) {

            if (['name', 'email', 'password'].indexOf(doc.name) > -1 && !doc.value) {
                doc.parentElement.classList.add('has-error')
                isValid = false;
            }

            if (doc.name == "gender") {
                if (doc.checked) {
                    user[doc.name] = doc.value
                }
            } else if (doc.name == "admin") {
                user[doc.name] = doc.checked;

            } else {
                user[doc.name] = doc.value

            }
        });

        if (!isValid) {
            return false
        }
        return new User(
            user.name,
            user.gender,
            user.birth,
            user.country,
            user.email,
            user.password,
            user.photo,
            user.admin
        );

    }

    addLine(dataUser) {

        let tr = document.createElement('tr');
        tr.innerHTML = `
        <tr>
                          <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
                          <td>${dataUser.name}</td>
                          <td>${dataUser.email}</td>
                          <td>${(dataUser.admin) ? 'Sim' : 'Não'}</td>
                          <td>${Utils.dateFormat(dataUser.register)}</td>
                          <td>
                            <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                            <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                          </td>
                        </tr>
        `;

        this.tableEl.appendChild(tr);

    }

}