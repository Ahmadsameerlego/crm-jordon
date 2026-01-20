<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        <!-- عروض الأسعار - {{ clientName }} -->
      </h3>
      <button @click="openAddModal" class="btn-primary">
        <i class="pi pi-plus mr-2"></i>
        إضافة عرض سعر جديد
      </button>
    </div>

    <!-- Error State -->
    <div v-if="error" class="card p-4">
      <div class="text-center text-red-600 dark:text-red-400">
        <i class="pi pi-exclamation-triangle text-xl mb-2"></i>
        <p>{{ error }}</p>
      </div>
    </div>

    <!-- Price Offers List -->
    <div class="space-y-4">
      <div v-for="(offer, index) in offers" :key="offer.id" class="relative card p-6 hover:shadow-lg transition-shadow">
        <span class="price_offer_number absolute top-2 right-2">{{ index + 1 }}</span>
        <div class="flex justify-between items-start mb-4">
          <div>
            <h4 class="text-lg font-bold text-yellow-100 dark:text-yellow-500">{{ offer.service_title_ar }}</h4>
            <p class="text-gray-600 dark:text-gray-400 mt-1 whitespace-pre-wrap">{{ offer.notes }}</p>
          </div>
          <div class="flex items-center space-x-2 space-x-reverse">
            <span class="inline-flex px-2 py-1 text-md font-semibold rounded-full"
              :class="getStatusClass(offer.status)">
              {{ offer.status_f }}
            </span>
            <div class="flex items-center space-x-1 space-x-reverse">
              <button @click="openEditModal(offer)"
                class="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300"
                title="تعديل">
                <i class="pi pi-pencil"></i>
              </button>
              <button @click="deleteOffer(offer.id)"
                class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300" title="حذف">
                <i class="pi pi-trash"></i>
              </button>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">المبلغ:</span>
            <p class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ offer.sub_total }} {{ offer.payment_method }}
            </p>
          </div>
          <div>
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">تاريخ الطلب:</span>
            <p class="text-gray-900 dark:text-white">{{ offer.order_date }}</p>
          </div>
          <div>
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">الوقت:</span>
            <p class="text-gray-900 dark:text-white">{{ offer.order_time }}</p>
          </div>
        </div>

        <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h5 class="text-lg font-bold text-yellow-100 dark:text-yellow-500 mb-2">الملفات المرفقة:</h5>

          <!-- Original Offer File -->
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center">
              <i class="pi pi-file-pdf text-red-500 mr-2"></i>
              <span class="text-sm text-gray-600 dark:text-gray-400">ملف العرض الأصلي:</span>
            </div>
            <div class="flex items-center space-x-2 space-x-reverse" v-if="offer.image">
              <button @click="downloadFile(offer.image)"
                class="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300"
                title="تحميل">
                <i class="pi pi-download"></i>
              </button>
              <button @click="previewFile(offer.image)"
                class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300" title="عرض">
                <i class="pi pi-eye"></i>
              </button>
            </div>
            <span v-else class="text-sm text-gray-400">لا يوجد ملف</span>
          </div>

          <!-- Contract File -->
          <div v-if="offer.status!=='new'" class="flex items-center justify-between">
            <div class="flex items-center">
              <i class="pi pi-file-pdf text-green-500 mr-2"></i>
              <span class="text-sm text-gray-600 dark:text-gray-400">ملف العقد:</span>
            </div>
            <div class="flex items-center space-x-2 space-x-reverse" v-if="offer.contract">
              <button @click="downloadFile(offer.contract)"
                class="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300"
                title="تحميل">
                <i class="pi pi-download"></i>
              </button>
              <button @click="previewFile(offer.contract)"
                class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300" title="عرض">
                <i class="pi pi-eye"></i>
              </button>
            </div>
            <span v-else class="text-sm text-gray-400">لا يوجد ملف</span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="offers.length === 0" class="text-center py-12">
        <i class="pi pi-file text-4xl text-gray-400 mb-4"></i>
        <p class="text-gray-500 dark:text-gray-400">لا توجد عروض أسعار لهذا العميل</p>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content p-6 max-w-2xl w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">
          {{ isEditing ? "تعديل عرض السعر" : "إضافة عرض سعر جديد" }}
        </h3>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              العنوان *
            </label>
            <input v-model="formData.service_title_ar" type="text" required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100"
              placeholder="عنوان عرض السعر" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              الوصف *
            </label>
            <textarea v-model="formData.notes" rows="3" required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100"
              placeholder="وصف تفصيلي للخدمة"></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                المبلغ *
              </label>
              <input v-model.number="formData.sub_total" type="number" required min="0" step="0.01"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100"
                placeholder="0.00" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                العملة *
              </label>
              <select v-model="formData.payment_method" required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100">
                                <option value="JOD">دينار أردني (JOD)</option>
                <option value="SAR">ريال سعودي (SAR)</option>
                <option value="USD">دولار أمريكي (USD)</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ملف العرض (PDF)
            </label>
            <input ref="fileInput" type="file" accept=".pdf,.png,.jpg,.jpeg" @change="handleFileChange"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100" />
            <p v-if="isEditing" class="mt-1 text-xs text-yellow-600 dark:text-yellow-400">
              اترك الحقل فارغاً إذا كنت لا تريد تغيير الملف الحالي
            </p>
          </div>

          <div class="flex justify-end space-x-3 space-x-reverse pt-4">
            <button type="button" @click="closeModal" class="btn-secondary">
              إلغاء
            </button>
            <button type="submit" class="btn-primary" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="animate-spin mr-2">⏳</span>
              {{ isEditing ? "تحديث" : "إضافة" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- File Preview Modal -->
    <div v-if="showPreviewModal" class="modal-overlay" @click="showPreviewModal = false">
      <div class="modal-content p-4 max-w-4xl h-5/6 w-full mx-4" @click.stop>
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">معاينة الملف</h3>
          <button @click="showPreviewModal = false" class="text-gray-500 hover:text-gray-700">
            <i class="pi pi-times text-xl"></i>
          </button>
        </div>
        <div class="h-[calc(100%-4rem)]">
          <iframe v-if="previewUrl?.toLowerCase().endsWith('.pdf')" :src="previewUrl"
            class="w-full h-full border-0 rounded" title="File Preview"></iframe>
          <img v-else :src="previewUrl" class="w-full h-full object-contain rounded" alt="File Preview" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from 'axios';

interface PriceOffer {
  id: number;
  service_title_ar: string;
  notes: string;
  sub_total: string;
  payment_method: string;
  status: string;
  status_f: string;
  order_date: string;
  order_time: string;
  image: string;
  contract: string;
  type: string;
}

const props = defineProps<{
  clientId: number;
  clientName: string;
  isEmployee?: boolean;
  offers: PriceOffer[]
}>();

const emit = defineEmits(['offer-added']);

// Reactive data
const showModal = ref(false);
const showPreviewModal = ref(false);
const isSubmitting = ref(false);
const isEditing = ref(false);
const previewUrl = ref("");
const error = ref("");
const editingOfferId = ref<number | null>(null);

const formData = ref({
  service_title_ar: "",
  notes: "",
  sub_total: 0,
  payment_method: "JOD",
  photo: null as File | null
});

const fileInput = ref<HTMLInputElement>();

// Methods
const getStatusClass = (status: string) => {
  const classes = {
    new: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    accepted: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    completed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
  };
  return classes[status as keyof typeof classes] || classes.new;
};

const resetForm = () => {
  formData.value = {
    service_title_ar: "",
    notes: "",
    sub_total: 0,
    payment_method: "JOD",
    photo: null
  };
  editingOfferId.value = null;
  if (fileInput.value) fileInput.value.value = '';
};

const openAddModal = () => {
  isEditing.value = false;
  resetForm();
  showModal.value = true;
};

const openEditModal = (offer: PriceOffer) => {
  isEditing.value = true;
  editingOfferId.value = offer.id;
  formData.value.service_title_ar = offer.service_title_ar;
  formData.value.notes = offer.notes;
  formData.value.sub_total = parseFloat(offer.sub_total);
  formData.value.payment_method = offer.payment_method;
  formData.value.photo = null;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  resetForm();
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    formData.value.photo = target.files[0];
  }
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  error.value = "";

  const submitFormData = new FormData();
  submitFormData.append('lang', 'ar');
  submitFormData.append('provider_id', props.clientId.toString());
  submitFormData.append('type', 'offer');
  submitFormData.append('service_title_ar', formData.value.service_title_ar);
  submitFormData.append('notes', formData.value.notes);
  submitFormData.append('sub_total', formData.value.sub_total.toString());
  submitFormData.append('payment_method', formData.value.payment_method);

  if (formData.value.photo) {
    submitFormData.append('photo', formData.value.photo);
  }

  const endpoint = isEditing.value
    ? "https://crm.be-kite.com/backend/api/update-order"
    : "https://crm.be-kite.com/backend/api/store-order";

  if (isEditing.value && editingOfferId.value) {
    submitFormData.append('order_id', editingOfferId.value.toString());
  }

  try {
    const { data } = await axios.post(endpoint, submitFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization' : localStorage.getItem('token')
      }
    });

    if (data && data.key === 1) {
      emit('offer-added'); // Refetch parent data
      closeModal();
    } else {
      error.value = data.msg || 'حدث خطأ أثناء حفظ عرض السعر';
    }
  } catch (err) {
    console.error("Error submitting offer:", err);
    error.value = 'حدث خطأ في الاتصال بالخادم';
  } finally {
    isSubmitting.value = false;
  }
};

const deleteOffer = async (id: number) => {
  if (!confirm("هل أنت متأكد من حذف هذا العرض؟")) return;

  try {
    const { data } = await axios.post("https://crm.be-kite.com/backend/api/delete-order", {
      order_id: id,
      lang: 'ar'
    }, {
      headers: {
        Authorization: localStorage.getItem('token')
      }
    });

    if (data && data.key === 1) {
      emit('offer-added');
    } else {
      alert(data.msg || 'فشل حذف العرض');
    }
  } catch (err) {
    console.error("Error deleting offer:", err);
    alert('حدث خطأ أثناء الحذف');
  }
};

const downloadFile = (fileUrl: string) => {
  const link = document.createElement("a");
  link.href = fileUrl;
  link.target = "_blank";
  link.download = fileUrl.split('/').pop() || 'file';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const previewFile = (fileUrl: string) => {
  previewUrl.value = fileUrl;
  showPreviewModal.value = true;
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  max-height: 90vh;
  overflow-y: auto;
}

.dark .modal-content {
  background: #1f2937;
  color: white;
}
.price_offer_number {
  position: absolute;
    right: 50%;
    top: -25px;
    display: flex
;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    width: 50px;
    height: 50px;
    background: #154d9b;
    color: #fff;
    font-weight: 700;
    border-radius: 50%;
}
</style>
