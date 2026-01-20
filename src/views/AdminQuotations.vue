<template>
  <AdminLayout>
    <template #title>الطلبات (عروض الأسعار )</template>

    <!-- Header Section -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center space-x-4 gap-3">
        <!-- Search Input -->
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="$t('common.search')"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100"
          />
          <i class="pi pi-search absolute right-3 left-2 top-1/3 transform -translate-y-1/2 text-gray-400"></i>
        </div>

        <!-- Employee Filter Dropdown -->
        <div class="relative">
          <select
            dir="ltr"
            v-model="selectedEmployeeId"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100 min-w-[200px]"
          >
            <option value="" selected hidden disabled>كل الموظفين</option>
            <option
              v-for="employee in employees"
              :key="employee.id"
              :value="employee.id"
            >
              {{ employee.first_name }}
            </option>
          </select>
        </div>
      </div>


    </div>

    <!-- Clients Table -->
    <div class="card">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                اسم الموظف
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                اسم المسئول
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                اسم الشركة
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                الخدمة المطلوبة
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                الملاحظات
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                المبلغ
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                الحالة
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                تاريخ الطلب
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                عروض الأسعار
              </th>
              <!-- <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                إجراءات
              </th> -->
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="client in filteredClients" :key="client.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ client.user_name }}
              </td>

              <td @click="openDescModal(client.provider_name)" :title="client.provider_name" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 max-w-[200px] overflow-hidden text-ellipsis cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                {{ client.provider_name }}
              </td>
               <td  @click="openDescModal(client.provider_first_name)"
                :title="client.provider_first_name" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 max-w-[200px] overflow-hidden text-ellipsis cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                {{ client.provider_first_name }}
              </td>
               <td  @click="openDescModal(client.service_title_ar)"
                :title="client.service_title_ar" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 max-w-[200px] overflow-hidden text-ellipsis cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                {{ client.service_title_ar }}
              </td>


              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 max-w-[200px] overflow-hidden text-ellipsis cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                @click="openDescModal(client.notes)"
                :title="client.notes"
              >
                {{ client.notes }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 max-w-[200px] overflow-hidden text-ellipsis cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                @click="openDescModal(client.sub_total)"
                :title="client.sub_total"
              >
                {{ client.sub_total }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium "
                :class="client.status === 'new' ? 'text-yellow-500' : 'text-green-500'"
              >
                {{ client.status_f }}
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ client.order_date_time }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                <button
                  class="btn-primary bg-red-500"
                  @click="openOffersModal(client)"
                >
                   عرض العروض
                </button>
              </td>

            </tr>
          </tbody>
        </table>
      </div>
    </div>



    <!-- Price Offers Modal -->
    <div v-if="showOffersModal" class="modal-overlay">
      <div class="modal-content p-4 max-w-6xl h-5/6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">
            عروض الأسعار - {{ selectedClient?.first_name }} {{ selectedClient?.full_name }}
          </h3>
          <button @click="showOffersModal = false" class="text-gray-500 hover:text-gray-700">
            <i class="pi pi-times text-xl"></i>
          </button>
        </div>
        <div class="h-full overflow-y-auto">
          <PriceOffersManager
            :clientId="selectedClient?.provider_id || 0"
            :client-name="`${selectedClient?.first_name} ${selectedClient?.last_name}` || ''"
            :offers="selectedClient?.offer_orders || order_offers"
            :is-employee="true"
            mode="employee"
            @offer-added="refreshClientData"
          />
        </div>
      </div>
    </div>

    <!-- Description Modal -->
    <div v-if="showDescModal" class="modal-overlay" @click="showDescModal = false">
      <div class="modal-content p-6 max-w-2xl w-full mx-4" @click.stop>
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold dark:text-gray-100">الملاحظات</h3>
          <button @click="showDescModal = false" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <i class="pi pi-times text-xl"></i>
          </button>
        </div>
        <div class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap max-h-[60vh] overflow-y-auto leading-relaxed">
          {{ selectedDesc || 'لا توجد ملاحظات' }}
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import AdminLayout from "@/components/AdminLayout.vue";
import PriceOffersManager from '@/components/PriceOffersManager.vue';

interface Client {
  id: number;
  first_name: string;
  address: string;
  full_name: string;
  phone_info: string;
  email_info: string;
  web_site: string;
  facebook: string;
  instagram: string;
  desc: string;
  photo: string;
  offer_orders_count: number;
  offer_orders: any[];
  last_name?: string;
  upload_by_name?: string;
  upload_by?: number; // ID الموظف اللي أضاف العميل
}

interface Employee {
  id: number;
  name: string;
}

const clients = ref<Client[]>([]);
const employees = ref([]);
const order_offers = ref([]);
const searchQuery = ref('');
const selectedEmployeeId = ref(''); // الموظف المختار
const showAddModal = ref(false);
const showEditModal = ref(false);
const selectedClient = ref<Client | null>(null);
const formData = ref<Partial<Client>>({
  first_name: '',
  address: '',
  full_name: '',
  phone_info: '',
  email_info: '',
  web_site: '',
  facebook: '',
  instagram: '',
  desc: '',
  photo: ''
});
const showOffersModal = ref(false);
const errorMessage = ref('');
const showDescModal = ref(false);
const selectedDesc = ref('');

// Computed - فلترة العملاء حسب البحث والموظف المختار
const filteredClients = computed(() => {
  let filtered = clients.value;

  // فلترة حسب الموظف المختار
  if (selectedEmployeeId.value) {
    filtered = filtered.filter(client =>
      client.user_id === Number(selectedEmployeeId.value)
    );
  }

  // فلترة حسب البحث
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(client =>
      (client.first_name || '').toLowerCase().includes(query) ||
      (client.full_name || '').toLowerCase().includes(query) ||
      (client.email_info || '').toLowerCase().includes(query) ||
      (client.upload_by_name || '').toLowerCase().includes(query)
    );
  }

  return filtered;
});

// جلب قائمة الموظفين
const fetchEmployees = async () => {
  try {
    const { data } = await axios.post("https://crm.be-kite.com/backend/api/employees", {
      lang: "ar"
    });

    if (data && data.key === 1 && data.data) {


      employees.value = data.data;
    }
  } catch (error) {
    console.error("Error fetching employees:", error);
  }
};

// جلب العملاء
const fetchOrders = async () => {
  try {
    const { data } = await axios.post("https://crm.be-kite.com/backend/api/show-all-orders", {
      lang: "ar"
    },
    {
        headers: {
            "Authorization": `${localStorage.getItem("token")}`
        }
    }
    );

    if (data && data.key === 1 && data.data) {
      clients.value = data.data;

      // // بعد جلب العملاء، نستخرج الموظفين منهم
      // const uniqueEmployees = new Map<number, Employee>();

      // data.data.forEach((client: Client) => {
      //   if (client.upload_by && client.upload_by_name && !uniqueEmployees.has(client.upload_by)) {
      //     uniqueEmployees.set(client.upload_by, {
      //       id: client.upload_by,
      //       name: client.upload_by_name
      //     });
      //   }
      // });

      // employees.value = Array.from(uniqueEmployees.values());
    }
  } catch (error) {
    console.error("Error fetching clients:", error);
  }
};



const refreshClientData = async () => {
  try {
    const { data } = await axios.post("https://crm.be-kite.com/backend/api/show-all-orders", {
      lang: "ar"
    },
    {
        headers: {
            "Authorization": `${localStorage.getItem("token")}`
        }
    }
  );

    if (data && data.key === 1 && data.data) {
      clients.value = data.data;
      const updatedClient = clients.value.find(c => c.id === selectedClient.value?.id);
      if (updatedClient) {
        selectedClient.value = updatedClient;
      }
    }
  } catch (error) {
    console.error("Error refreshing client data:", error);
  }
};







const openOffersModal = async (client: Client) => {
  selectedClient.value = client;
  showOffersModal.value = true;

  try {
    const { data } = await axios.post("https://crm.be-kite.com/backend/api/show-all-orders", {
      lang: "ar",
      type : "offer",
      provider_id : client?.provider_id
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${localStorage.getItem("token")}`
      }
    }
);

    if (data && data.key === 1 && data.data) {
      order_offers.value = data.data;
    //   const updatedClient = clients.value.find(c => c.id === selectedClient.value?.id);
    //   if (updatedClient) {
    //     selectedClient.value = updatedClient;
    //   }
    }
  } catch (error) {
    console.error("Error refreshing client data:", error);
  }
};

const openDescModal = (desc: string) => {
  selectedDesc.value = desc;
  showDescModal.value = true;
};

onMounted(fetchOrders );
onMounted(fetchEmployees );
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.dark .modal-content {
  background: #1f2937;
}

.input-field {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
}

.dark .input-field {
  background: #374151;
  border-color: #4b5563;
  color: #f3f4f6;
}
</style>
