console.log("main js ishga tushdi");
    $(function () {
      $(".product_collection").on("change", () => {
        const selectedValue = $(".product_collection").val();
        if (selectedValue === "meat" || selectedValue === "fresh") {
          $("#product_weight").show();
          $("#product_volume").hide();
          $("#product_size").hide();
          $("#product_etc").hide();
        } else if (selectedValue === "drink") {
          $("#product_volume").show();
          $("#product_weight").hide();
          $("#product_size").hide();
          $("#product_etc").hide();
        } else if (
          selectedValue === "family" ||
          selectedValue === "readyToEat" ||
          selectedValue === "parfumerie" ||
          selectedValue === "texno"
        ) {
          $("#product_etc").show();
          $("#product_size").hide();
          $("#product_volume").hide();
          $("#product_weight").hide();
        } else {
          $("#product_size").show();
          $("#product_volume").hide();
          $("#product_weight").hide();
          $("#product_etc").hide();
        }
      });

      // "taom qo'shish" tugmasi bosilganda ".dish_container" ochilish functionni ->
      $(".hiding_btn").on("click", () => {
        $(".dish_container").slideToggle(500);
        $(".hiding_btn").css("display", "none");
      });

      // product status changer
      $(".new_product_status").on("change", async function (e) {
        const id = e.target.id;
        // "PROCES" yoki "PAUSED" larni bosganda o'sha bosilganini qiymatini olib beradi ->
        const product_status = $(`#${id}.new_product_status`).val();

        try {
          const response = await axios.post(`/brand/products/edit/${id}`, {
            id: id,
            product_status: product_status,
          });
          const result = response.data;
          console.log("result", result);

          if (result.state == "success") {
            alert("success");
            location.reload();
          } else {
            alert(result.message);
          }
        } catch (err) {
          console.log("update Chosen Product err:", err);
        }
      });
    });

    // form validate
    function validateForm() {
      const market_mb_id = $(".market_mb_id").val(),
        product_name = $(".product_name").val(),
        product_price = $(".product_price").val(),
        product_left_cnt = $(".product_left_cnt").val(),
        product_collection = $(".product_price").val(),
        product_description = $(".product_description").val(),
        product_status = $(".product_price").val();

      if (
        market_mb_id == "" ||
        product_name == "" ||
        product_price == "" ||
        product_left_cnt == "" ||
        product_collection == "" ||
        product_description == "" ||
        product_status == ""
      ) {
        alert("Please enter all information!");
        return false;
      } else return true;
    }

    // img hendler
    function previewFileHandler(input, order) {
      const image_class_name = input.className;
      const file = $(`.${image_class_name}`).get(0).files[0],
        fileType = file["type"],
        validImageTypes = ["image/jpg", "image/jpeg", "image/png"];

      if (!validImageTypes.includes(fileType)) {
        alert("Please upload images in a licensed format! (jpg, jpeg, png)");
      } else {
        if (file) {
          let reader = new FileReader();
          reader.onload = function () {
            $(`#image_section_${order}`).attr("src", reader.result);
          };
          reader.readAsDataURL(file);
        }
      }
    }

    // document get ready
    $(function () {
      // monupulate markets top features
      $(".mb_top").on("change", function (e) {
        // marketlarni .id sini olinyapti ->
        const id = e.target.id;
        const mb_top = e.target.checked ? "Y" : "N";
        // update bo'lgan datani bodyga yuklanyapti ->
        axios
          .post("/brand/all-brand/edit", { id: id, mb_top: mb_top })
          .then((response) => {
            //response.data ni ichida marketController[164] (res.jsonga path qilganimiz) beriladi
            const result = response.data;
            if (result.state === "success") alert("successfully updated");
            else alert(result.message);
          })
          .catch((err) => console.log(err));
      });

      /*  monupulate markets STATUS features */
      $(".mb_status").on("change", function (e) {
        // marketlarni .id sini olinyapti ->
        const id = e.target.id;
        const mb_status = $(`#${id}.mb_status`).val();

        // update bo'lgan datani bodyga yuklanyapti ->
        axios
          .post("/brand/all-brand/edit", { id: id, mb_status: mb_status })
          .then((response) => {
            //response.data ni ichida marketController[164] (res.jsonga path qilganimiz) beriladi
            const result = response.data;
            if (result.state === "success") alert("successfully updated");
            else alert(result.message);
          })
          .catch((err) => console.log(err));
      });
    });


//navigation
const  goHome=()=> location.href = "/furni";